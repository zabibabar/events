import { Types } from 'mongoose'
import { NotificationType } from '../enums/notification-type.enum'
import { Sender } from '../interfaces/sender.interface'
import { NotificationFactory } from './notification.factory'
import { NotificationCreate } from '../types/notification-create'
import { EventService } from 'src/events/event.service'
import { EventAttendeesRecipientStrategy } from '../strategies/event-attendees.strategy'
import { Inject, Injectable, forwardRef } from '@nestjs/common'

@Injectable()
export class EventAttendeesUpdatedNotificationFactory extends NotificationFactory {
  constructor(@Inject(forwardRef(() => EventService)) private eventService: EventService) {
    super(new EventAttendeesRecipientStrategy(eventService))
  }

  async createNotification(
    entityId: Types.ObjectId,
    senders: Sender[]
  ): Promise<NotificationCreate> {
    const event = await this.eventService.getEvent(entityId.toJSON())
    const recipients = await this.recipientStrategy.getRecipients(event.groupId.toJSON())
    const link = this.getLink(event.groupId.toJSON(), entityId.toJSON())

    return {
      recipients,
      senders,
      entityId,
      entityModel: 'Event',
      type: NotificationType.EVENT_ATTENDEES_UPDATED,
      link
    }
  }

  protected getMessageTemplate(): string {
    return '{{recipient}} updated their attendance for the event {{entity}}'
  }

  protected getLink(groupId: string, eventId: string): string {
    return `/groups${groupId}/events/${eventId}/attendees`
  }
}
