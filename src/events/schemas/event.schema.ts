import { Schema, Document } from 'mongoose'
import { GROUP_COLLECTION_NAME } from 'src/groups/schemas/group.schema'
import { Attendee } from '../interfaces/attendee.interface'

import { AttendeeSchema } from './attendee.schema'

export const EventSchema = new Schema(
  {
    name: { type: String, required: true },
    group: { type: Schema.Types.ObjectId, ref: GROUP_COLLECTION_NAME, required: true },
    timeStart: { type: Date, required: true },
    timeEnd: { type: Date, required: true },
    description: String,
    attendees: [AttendeeSchema],
    address: { type: String, required: true },
    hasPot: { type: Boolean, default: false }
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
  hasPot: boolean
}

export const EVENT_COLLECTION_NAME = 'Event'
