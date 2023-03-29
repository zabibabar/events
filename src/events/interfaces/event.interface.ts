import { Types } from 'mongoose'
import { Attendee } from './attendee.interface'

export interface Event {
  id: string
  groupId: Types.ObjectId
  name: string
  picture: string
  timeStart: Date
  timeEnd: Date
  address: string
  description?: string
  attendees: Attendee[]
}
