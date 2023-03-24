import { Attendee } from './attendee.interface'

export interface Event {
  id: string
  groupId: string
  name: string
  picture: string
  timeStart: Date
  timeEnd: Date
  address: string
  description?: string
  attendees: Attendee[]
}
