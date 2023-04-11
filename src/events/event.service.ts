import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'

import { EventDocument, EVENT_COLLECTION_NAME } from './schemas/event.schema'
import { Event } from './interfaces/event.interface'
import { Attendee } from './interfaces/attendee.interface'
import { CreateEventDTO } from './dto/create-event.dto'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'
import { UpdateAttendeeDTO } from './dto/update-attendee.dto'
import { UpdateEventDTO } from './dto/update-event.dto'
import { EventQueryParamDTO } from './dto/event-query-param.dto'
import { GroupMemberService } from 'src/groups/group-member.service'
import { EventCountResponseDTO } from './dto/event-count-response.dto'
import { GroupService } from 'src/groups/group.service'

@Injectable()
export class EventService {
  constructor(
    @InjectModel(EVENT_COLLECTION_NAME) private readonly EventModel: Model<EventDocument>,
    private groupMemberService: GroupMemberService,
    @Inject(forwardRef(() => GroupService)) private groupService: GroupService,
    private cloudinary: CloudinaryService
  ) {}

  async getEventsByUserId(userId: string, filterOptions: EventQueryParamDTO): Promise<Event[]> {
    const { skip, pastLimit, upcomingLimit, currentDate, isAttending } = filterOptions

    const groups = await this.groupService.getGroups(userId, { skip: 0, limit: 0 })
    const groupIds = groups.map(({ id }) => id)

    const filterQuery: FilterQuery<EventDocument> = { groupId: { $in: groupIds } }
    if (isAttending) filterQuery.attendees = { $elemMatch: { id: userId, isGoing: true } }

    const events: Event[] = []
    if (pastLimit)
      events.push(...(await this.getPastEvents(filterQuery, pastLimit, skip, currentDate)))
    if (upcomingLimit)
      events.push(...(await this.getUpcomingEvents(filterQuery, upcomingLimit, skip, currentDate)))

    return events
  }

  async getEventsByGroupId(groupId: string, filterOptions: EventQueryParamDTO): Promise<Event[]> {
    const { skip, pastLimit, upcomingLimit, currentDate } = filterOptions
    const filterQuery: FilterQuery<EventDocument> = { groupId }

    const events: Event[] = []
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

  async getEventCountByGroupId(groupId: string, currentDate: Date): Promise<EventCountResponseDTO> {
    const upcoming = await this.EventModel.countDocuments({
      groupId,
      timeStart: { $gte: currentDate }
    })

    const past = await this.EventModel.countDocuments({
      groupId,
      timeEnd: { $lt: currentDate }
    })

    return { upcoming, past }
  }

  async isEventUpcoming(eventId: string, currentDate: Date): Promise<boolean> {
    const event = await this.getEvent(eventId)

    return event.timeEnd.getTime() > currentDate.getTime()
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
      attendees: [{ id: userId, isGoing: true, isOrganizer: true }]
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
    // TODO: Check if current user is organizer of the group
    const attendees = await this.getEventAttendees(eventId)
    const isAttendee = attendees.find(({ id }) => id.equals(attendeeId))

    if (!isAttendee) throw new NotFoundException('Attendee not found')

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

  async addEventAttendee(eventId: string, attendeeId: string): Promise<Attendee[]> {
    const eventDoc = await this.EventModel.findOneAndUpdate(
      { _id: eventId, 'attendees.id': { $ne: attendeeId } },
      { $push: { attendees: { id: attendeeId, isGoing: true } } },
      { new: true }
    )
      .populate({
        path: 'attendees.user',
        select: 'name picture'
      })
      .exec()

    return this.convertEventDocumentToEvent(eventDoc).attendees
  }

  async removeAttendeeFromAllEvents(attendeeId: string): Promise<void> {
    await this.EventModel.updateMany(
      { attendees: { $elemMatch: { id: attendeeId } } },
      { $pull: { attendees: { id: attendeeId } } },
      { new: true }
    ).exec()
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
