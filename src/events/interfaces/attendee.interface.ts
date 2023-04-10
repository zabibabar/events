import { Types } from 'mongoose'

export interface Attendee {
  id: Types.ObjectId
  isGoing: boolean
  isOrganizer: boolean
}
