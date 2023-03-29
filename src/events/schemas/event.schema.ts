import { Schema, HydratedDocument } from 'mongoose'
import { GROUP_COLLECTION_NAME } from 'src/groups/schemas/group.schema'
import { Event } from '../interfaces/event.interface'

import { AttendeeSchema } from './attendee.schema'

export const EventSchema = new Schema<Event>(
  {
    groupId: { type: Schema.Types.ObjectId, ref: GROUP_COLLECTION_NAME, required: true },
    name: { type: String, required: true },
    picture: { type: String, default: '' },
    timeStart: { type: Date, required: true },
    timeEnd: { type: Date, required: true },
    description: String,
    attendees: [AttendeeSchema],
    address: { type: String, required: true }
  },
  {
    timestamps: false,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret.__v
        delete ret._id
        return ret
      }
    }
  }
)

export type EventDocument = HydratedDocument<Event>

export const EVENT_COLLECTION_NAME = 'Event'
