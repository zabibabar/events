import { Attendee } from './attendee.interface'

export interface Event {
  id: string
  group: string
  name: string
  timeStart: Date
  timeEnd: Date
  description?: string
  attendees: Attendee[]
  address: string
  hasPot?: boolean
}
