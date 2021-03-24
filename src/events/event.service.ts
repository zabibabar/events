import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { EventDocument, EVENT_COLLECTION_NAME } from './schemas/event.schema'
import { Event } from './interfaces/event.interface'
import { Attendee } from './interfaces/attendee.interface'
import { UpdateEventDTO } from './dto/update-event.dto'
import { CreateEventDTO } from './dto/create-event.dto'

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(EVENT_COLLECTION_NAME) private readonly EventModel: Model<EventDocument>
  ) {}

  async getEvents(): Promise<Event[]> {
    const events = await this.EventModel.find().exec()
    return events
  }

  async createEvent(body: CreateEventDTO): Promise<Event> {
    const newEvent = new this.EventModel(body)
    return newEvent.save()
  }

  async getEvent(eventID: string): Promise<Event> {
    const event = await this.findEvent(eventID)
    return event
  }

  async updateEvent(eventID: string, EventFields: UpdateEventDTO): Promise<void> {
    delete EventFields.attendees
    await this.EventModel.updateOne({ _id: eventID }, { $set: EventFields }).exec()
  }

  async deleteEvent(EventID: string): Promise<void> {
    const result = await this.EventModel.deleteOne({ _id: EventID }).exec()
    if (result.n === 0) throw new NotFoundException('Event not found')
  }

  async addEventAttendees(eventID: string, attendees: Attendee[]): Promise<void> {
    await this.EventModel.updateOne(
      { _id: eventID },
      { $push: { attendees: { $each: attendees } } }
    ).exec()
  }

  async removeEventAttendees(eventID: string, attendees: string[]): Promise<void> {
    await this.EventModel.updateOne(
      { _id: eventID },
      { $pull: { attendees: { attendee: { $in: attendees } } } }
    ).exec()
  }

  private async findEvent(eventID: string): Promise<EventDocument> {
    let event: EventDocument
    try {
      event = await this.EventModel.findById(eventID).exec()
    } catch {
      throw new NotFoundException('Event not found')
    } finally {
      if (!event) {
        throw new NotFoundException('Event not found')
      }
      return event
    }
  }
}
