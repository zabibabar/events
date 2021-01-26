import { Schema, Document } from 'mongoose'

const GroupSchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId, ref: 'Group' },
    name: { type: String, required: true }
  },
  { timestamps: true }
)

const OrganizerSchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true }
  },
  { timestamps: true }
)

const AttendeeSchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    going: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

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

export interface Organizer {
  id: string
  name: string
}

export interface Attendee {
  id: string
  name: string
  going: boolean
  lastUpdated: Date
}

export interface Event extends Document {
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
