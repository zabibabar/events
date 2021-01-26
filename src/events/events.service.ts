import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Event, Attendee, Organizer } from './events.model'

@Injectable()
export class EventsService {
  constructor(@InjectModel('Event') private readonly EventModel: Model<Event>) {}

  async getEvents() {
    const events = await this.EventModel.find().exec()
    return events
  }

  async createEvent(body: Event) {
    const newEvent = new this.EventModel(body)
    return newEvent.save()
  }

  async getEvent(eventdID: string) {
    const event = await this.findEvent(eventdID)
    return event
  }

  async updateEvent(eventdID: string, EventFields: Partial<Event>) {
    delete EventFields.attendees
    await this.EventModel.updateOne({ _id: eventdID }, { $set: EventFields }).exec()
  }

  async deleteEvent(EventID: string) {
    const result = await this.EventModel.deleteOne({ _id: EventID }).exec()
    if (result.n === 0) throw new NotFoundException('Event not found')
  }

  async addEventOrganizers(eventdID: string, organizers: Organizer[]) {
    await this.EventModel.updateOne(
      { _id: eventdID },
      { $push: { organizers: { $each: organizers } } }
    ).exec()
  }

  async removeEventOrganizers(eventdID: string, organizers: string[]) {
    await this.EventModel.updateOne(
      { _id: eventdID },
      { $pull: { organizers: { id: { $in: organizers } } } }
    ).exec()
  }

  async addEventAttendees(eventdID: string, attendees: Attendee[]) {
    await this.EventModel.updateOne(
      { _id: eventdID },
      { $push: { attendees: { $each: attendees } } }
    ).exec()
  }

  async removeEventAttendees(eventdID: string, attendees: string[]) {
    await this.EventModel.updateOne(
      { _id: eventdID },
      { $pull: { attendees: { id: { $in: attendees } } } }
    ).exec()
  }

  private async findEvent(eventdID: string) {
    let event
    try {
      event = await this.EventModel.findById(eventdID).exec()
    } catch {
      throw new NotFoundException('Event not found')
    } finally {
      if (!event) {
        throw new NotFoundException('Event not found')
      }
      return event as Event
    }
  }
}
