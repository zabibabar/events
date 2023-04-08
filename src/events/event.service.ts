import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'

import { EventDocument, EVENT_COLLECTION_NAME } from './schemas/event.schema'
import { Event } from './interfaces/event.interface'
import { Attendee } from './interfaces/attendee.interface'
import { CreateEventDTO } from './dto/create-event.dto'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'
import { UpdateAttendeeDTO } from './dto/update-attendee-dto'
import { UpdateEventDTO } from './dto/update-event.dto'
import { EventQueryParamDTO } from './dto/event-query-param.dto'
import { GroupMemberService } from 'src/groups/group-member.service'

@Injectable()
export class EventService {
  constructor(
    @InjectModel(EVENT_COLLECTION_NAME) private readonly EventModel: Model<EventDocument>,
    private groupMemberService: GroupMemberService,
    private cloudinary: CloudinaryService
  ) {}

  async getEvents(userId: string, filterOptions: EventQueryParamDTO): Promise<Event[]> {
    const { skip, pastLimit, upcomingLimit, currentDate, groupId } = filterOptions
    const events: Event[] = []
    const filterQuery: FilterQuery<EventDocument> = {}

    if (!groupId && !userId) throw new BadRequestException('Invalid Request Params')

    if (groupId) filterQuery.groupId = groupId
    if (userId) filterQuery.attendees = { $elemMatch: { id: userId, isGoing: true } }

    if (pastLimit)
      events.push(...(await this.getPastEvents(filterQuery, pastLimit, skip, currentDate)))
    if (upcomingLimit)
      events.push(...(await this.getUpcomingEvents(filterQuery, upcomingLimit, skip, currentDate)))

    return events
  }

  private async getUpcomingEvents(
    filterQuery: FilterQuery<EventDocument>,
    limit: number,
    skip = 0,
    currentDate: Date
  ): Promise<Event[]> {
    const upcomingEvents = await this.EventModel.find({
      ...filterQuery,
      timeStart: { $gte: currentDate }
    })
      .sort({ timeStart: 1 })
      .limit(limit)
      .skip(skip)
      .populate({
        path: 'attendees.user',
        select: 'name picture'
      })
      .exec()

    return upcomingEvents.map((event) => this.convertEventDocumentToEvent(event))
  }

  private async getPastEvents(
    filterQuery: FilterQuery<EventDocument>,
    limit = 10,
    skip = 0,
    currentDate: Date
  ): Promise<Event[]> {
    const pastEvent = await this.EventModel.find({
      ...filterQuery,
      timeEnd: { $lt: currentDate }
    })
      .sort({ timeStart: -1 })
      .limit(limit)
      .skip(skip)
      .populate({
        path: 'attendees.user',
        select: 'name picture'
      })
      .exec()

    return pastEvent.map((event) => this.convertEventDocumentToEvent(event))
  }

  async getEvent(eventId: string): Promise<Event> {
    let eventDoc: EventDocument | null = null
    try {
      eventDoc = await this.EventModel.findById(eventId)
        .populate({
          path: 'attendees.user',
          select: 'name picture'
        })
        .exec()
    } catch {
      throw new NotFoundException('Event not found')
    } finally {
      if (!eventDoc) throw new NotFoundException('Event not found')
      return this.convertEventDocumentToEvent(eventDoc)
    }
  }

  async createEvent(body: CreateEventDTO, userId: string): Promise<Event> {
    const isUserGroupOrganizer = await this.groupMemberService.isGroupOrganizer(
      body.groupId,
      userId
    )
    if (!isUserGroupOrganizer)
      throw new BadRequestException('User is not eligible to create an event in the group')

    const newEvent = new this.EventModel({
      ...body,
      attendees: [{ id: userId, going: true, isOrganizer: true }]
    })
    return this.convertEventDocumentToEvent(await newEvent.save())
  }

  async updateEvent(
    eventId: string,
    eventFields: UpdateEventDTO & { picture?: string }
  ): Promise<Event> {
    const eventDoc = await this.EventModel.findOneAndUpdate(
      { _id: eventId },
      { $set: eventFields },
      { new: true }
    ).exec()

    return this.convertEventDocumentToEvent(eventDoc)
  }

  async deleteEvent(eventId: string): Promise<void> {
    const result = await this.EventModel.deleteOne({ _id: eventId }).exec()
    if (result.deletedCount === 0) throw new NotFoundException('Event not found')
  }

  async getEventAttendees(eventId: string): Promise<Attendee[]> {
    return (await this.getEvent(eventId)).attendees
  }

  async updateEventAttendee(
    eventId: string,
    attendeeId: string,
    updates: UpdateAttendeeDTO
  ): Promise<Attendee[]> {
    // Check if current user is attendee or organizer of the group
    const attendees = await this.getEventAttendees(eventId)
    const isAttendeeNew = !attendees.some(({ id }) => id.equals(attendeeId))

    if (isAttendeeNew) return this.addEventAttendee(eventId, attendeeId, updates)

    const eventDoc = await this.EventModel.findOneAndUpdate(
      { _id: eventId, 'attendees.id': attendeeId },
      { $set: { 'attendees.$.isGoing': updates.isGoing } },
      { new: true }
    )
      .populate({
        path: 'attendees.user',
        select: 'name picture'
      })
      .exec()

    return this.convertEventDocumentToEvent(eventDoc).attendees
  }

  async addEventAttendee(
    eventId: string,
    attendeeId: string,
    updates: UpdateAttendeeDTO
  ): Promise<Attendee[]> {
    const eventDoc = await this.EventModel.findOneAndUpdate(
      { _id: eventId, 'attendees.id': { $ne: attendeeId } },
      { $push: { ...updates, id: attendeeId } },
      { new: true }
    )
      .populate({
        path: 'attendees.user',
        select: 'name picture'
      })
      .exec()

    return this.convertEventDocumentToEvent(eventDoc).attendees
  }

  async uploadEventPicture(eventsId: string, file: Express.Multer.File): Promise<string> {
    try {
      const { secure_url } = await this.cloudinary.uploadImage(file, {
        folder: `events/${eventsId}`,
        public_id: 'thumbnail',
        overwrite: true
      })
      return (await this.updateEvent(eventsId, { picture: secure_url })).picture
    } catch (err) {
      throw new BadRequestException('Invalid file type.')
    }
  }

  private convertEventDocumentToEvent(eventDoc: EventDocument | null): Event {
    if (!eventDoc) {
      throw new NotFoundException('Event not found')
    }

    return eventDoc.toJSON()
  }
}
