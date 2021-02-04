import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { EventDocument } from './schemas/event.schema'
import { Event } from './interfaces/event.interface'
import { Attendee } from './interfaces/attendee.interface'
import { Organizer } from './interfaces/organizer.interface'
import { UpdateEventDTO } from './dto/update-event.dto'
import { CreateEventDTO } from './dto/create-event.dto'

@Injectable()
export class EventsService {
  constructor(@InjectModel('Event') private readonly EventModel: Model<EventDocument>) {}

  async getEvents(): Promise<Event[]> {
    const events = await this.EventModel.find().exec()
    return events
  }

  async createEvent(body: CreateEventDTO): Promise<Event> {
    const newEvent = new this.EventModel(body)
    return newEvent.save()
  }

  async getEvent(eventdID: string): Promise<Event> {
    const event = await this.findEvent(eventdID)
    return event
  }

  async updateEvent(eventdID: string, EventFields: UpdateEventDTO): Promise<void> {
    delete EventFields.attendees
    await this.EventModel.updateOne({ _id: eventdID }, { $set: EventFields }).exec()
  }

  async deleteEvent(EventID: string): Promise<void> {
    const result = await this.EventModel.deleteOne({ _id: EventID }).exec()
    if (result.n === 0) throw new NotFoundException('Event not found')
  }

  async addEventOrganizers(eventdID: string, organizers: Organizer[]): Promise<void> {
    await this.EventModel.updateOne(
      { _id: eventdID },
      { $push: { organizers: { $each: organizers } } }
    ).exec()
  }

  async removeEventOrganizers(eventdID: string, organizers: string[]): Promise<void> {
    await this.EventModel.updateOne(
      { _id: eventdID },
      { $pull: { organizers: { id: { $in: organizers } } } }
    ).exec()
  }

  async addEventAttendees(eventdID: string, attendees: Attendee[]): Promise<void> {
    await this.EventModel.updateOne(
      { _id: eventdID },
      { $push: { attendees: { $each: attendees } } }
    ).exec()
  }

  async removeEventAttendees(eventdID: string, attendees: string[]): Promise<void> {
    await this.EventModel.updateOne(
      { _id: eventdID },
      { $pull: { attendees: { id: { $in: attendees } } } }
    ).exec()
  }

  private async findEvent(eventdID: string): Promise<EventDocument> {
    let event: EventDocument
    try {
      event = await this.EventModel.findById(eventdID).exec()
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
