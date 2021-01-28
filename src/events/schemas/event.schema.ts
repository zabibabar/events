import { Schema, Document } from 'mongoose'
import { Attendee } from '../interfaces/attendee.interface'
import { Organizer } from '../interfaces/organizer.interface'

import { AttendeeSchema } from './attendee.schema'
import { OrganizerSchema } from './organizer.schema'

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
    organizers: { type: [OrganizerSchema], required: true },
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
  organizers: [Organizer]
  attendees: [Attendee]
  address: string
  isRemote: boolean
  hasPot: boolean
}
