import { Attendee } from './attendee.interface'
import { Organizer } from './organizer.interface'

export interface Event {
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
