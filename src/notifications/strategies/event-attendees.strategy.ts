import { RecipientStrategy } from '../interfaces/recipient-strategy.interface'
import { Recipient } from '../interfaces/recipient.interface'
import { EventService } from 'src/events/event.service'

export class EventAttendeesRecipientStrategy implements RecipientStrategy {
  constructor(private eventService: EventService) {}

  async getRecipients(entityId: string): Promise<Recipient[]> {
    const event = await this.eventService.getEvent(entityId)
    if (!event) {
      throw new Error(`Event with id ${entityId} not found`)
    }
    return event.attendees.map(({ id }) => ({ id, isRead: false }))
  }
}
