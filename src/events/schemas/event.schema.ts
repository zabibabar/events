import { Schema, Document } from 'mongoose'
import { Attendee } from '../interfaces/attendee.interface'

import { AttendeeSchema } from './attendee.schema'

const GroupSchema = new Schema({
  id: { type: Schema.Types.ObjectId, ref: 'Group' },
  name: { type: String, required: true }
})

export const EventSchema = new Schema(
  {
    name: { type: String, required: true },
    group: { type: GroupSchema, required: true },
    timeStart: { type: Date, required: true },
    timeEnd: { type: Date, required: true },
    description: String,
    attendees: [AttendeeSchema],
    address: { type: String, required: true },
    isRemote: {
      type: Boolean,
      default: false
    },
    hasPot: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

export interface EventDocument extends Document {
  id: string
  group: string
  name: string
  timeStart: Date
  timeEnd: Date
  description: string
  attendees: Attendee[]
  address: string
  isRemote: boolean
  hasPot: boolean
}

export const EVENT_COLLECTION_NAME = 'Event'
