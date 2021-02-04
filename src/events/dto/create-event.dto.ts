import { Attendee } from '../interfaces/attendee.interface'
import { Organizer } from '../interfaces/organizer.interface'

export class CreateEventDTO {
  group: string
  name: string
  timeStart: Date
  timeEnd: Date
  description?: string
  organizers: Organizer[]
  attendees?: Attendee[]
  address: string
  isRemote?: boolean
  hasPot?: boolean
}
