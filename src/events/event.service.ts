import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { EventDocument, EVENT_COLLECTION_NAME } from './schemas/event.schema'
import { Event } from './interfaces/event.interface'
import { Attendee } from './interfaces/attendee.interface'
import { CreateEventDTO } from './dto/create-event.dto'
import { GroupService } from 'src/groups/group.service'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'

@Injectable()
export class EventService {
  constructor(
    @InjectModel(EVENT_COLLECTION_NAME) private readonly EventModel: Model<EventDocument>,
    private groupService: GroupService,
    private cloudinary: CloudinaryService
  ) {}

  async getEvents(userId: string): Promise<Event[]> {
    const events = await this.EventModel.find({
      attendees: { $elemMatch: { id: userId } }
    }).exec()

    return events.map((event) => this.convertEventDocumentToEvent(event))
  }

  async getEventsByGroupId(groupId: string): Promise<Event[]> {
    const events = await this.EventModel.find({ groupId }).exec()

    return events.map((event) => this.convertEventDocumentToEvent(event))
  }

  getEvent(eventId: string): Promise<Event> {
    return this.findEvent(eventId)
  }

  async createEvent(body: CreateEventDTO, userId: string): Promise<Event> {
    const isUserGroupMember = await this.groupService.isGroupMember(body.groupId, userId)
    if (!isUserGroupMember)
      throw new BadRequestException('User is not eligible to create an event in the group')

    const newEvent = new this.EventModel({
      ...body,
      attendees: [{ id: userId, going: true, isOrganizer: true }]
    })
    return this.convertEventDocumentToEvent(await newEvent.save())
  }

  async updateEvent(eventId: string, eventFields: Partial<Event>): Promise<Event> {
    delete eventFields.attendees
    const eventDoc = await this.EventModel.findOneAndUpdate(
      { _id: eventId },
      { $set: eventFields },
      { new: true }
    ).exec()

    return this.convertEventDocumentToEvent(eventDoc)
  }

  async deleteEvent(eventId: string): Promise<void> {
    const result = await this.EventModel.deleteOne({ _id: eventId }).exec()
    if (result.n === 0) throw new NotFoundException('Event not found')
  }

  async getEventAttendees(eventId: string): Promise<Attendee[]> {
    return (await this.getEvent(eventId)).attendees
  }

  async addEventAttendee(eventId: string, attendee: Attendee): Promise<Attendee[]> {
    const eventDoc = await this.EventModel.findOneAndUpdate(
      { _id: eventId, 'attendees.id': { $ne: attendee.id } },
      { $push: attendee },
      { new: true }
    ).exec()

    return this.convertEventDocumentToEvent(eventDoc).attendees
  }

  async removeEventAttendees(eventId: string, attendeeIds: string[]): Promise<void> {
    await this.EventModel.updateOne(
      { _id: eventId },
      { $pull: { attendees: { id: { $in: attendeeIds } } } }
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

  private async findEvent(eventId: string): Promise<Event> {
    let event: EventDocument | null = null
    try {
      event = await this.EventModel.findById(eventId).exec()
    } catch {
      throw new NotFoundException('Event not found')
    } finally {
      return this.convertEventDocumentToEvent(event)
    }
  }

  private convertEventDocumentToEvent(eventDoc: EventDocument | null): Event {
    if (!eventDoc) {
      throw new NotFoundException('Event not found')
    }

    const {
      id,
      groupId,
      name,
      picture,
      timeStart,
      timeEnd,
      description,
      attendees,
      address
    } = eventDoc
    return {
      id,
      groupId,
      name,
      picture,
      timeStart,
      timeEnd,
      description,
      attendees,
      address
    }
  }
}
