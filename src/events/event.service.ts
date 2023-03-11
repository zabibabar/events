import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { EventDocument, EVENT_COLLECTION_NAME } from './schemas/event.schema'
import { Event } from './interfaces/event.interface'
import { Attendee } from './interfaces/attendee.interface'
import { UpdateEventDTO } from './dto/update-event.dto'
import { CreateEventDTO } from './dto/create-event.dto'

@Injectable()
export class EventService {
  constructor(
    @InjectModel(EVENT_COLLECTION_NAME) private readonly EventModel: Model<EventDocument>
  ) {}

  async getEvents(): Promise<Event[]> {
    const events = await this.EventModel.find().exec()
    return events.map((event) => this.convertEventDocumentToEvent(event))
  }

  async createEvent(body: CreateEventDTO): Promise<Event> {
    const newEvent = new this.EventModel(body)
    return this.convertEventDocumentToEvent(await newEvent.save())
  }

  getEvent(eventId: string): Promise<Event> {
    return this.findEvent(eventId)
  }

  async updateEvent(eventId: string, eventFields: UpdateEventDTO): Promise<Event> {
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

  async addEventAttendees(eventId: string, attendees: Attendee[]): Promise<Attendee[]> {
    const eventDoc = await this.EventModel.findOneAndUpdate(
      { _id: eventId },
      { $addToSet: { attendees: { $each: attendees } } },
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
      group,
      name,
      timeStart,
      timeEnd,
      description,
      attendees,
      address,
      hasPot
    } = eventDoc
    return {
      id,
      group,
      name,
      timeStart,
      timeEnd,
      description,
      attendees,
      address,
      hasPot
    }
  }
}
