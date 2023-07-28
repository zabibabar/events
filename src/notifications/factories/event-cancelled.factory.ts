import { Types } from 'mongoose'
import { NotificationType } from '../enums/notification-type.enum'
import { Sender } from '../interfaces/sender.interface'
import { NotificationFactory } from './notification.factory'
import { NotificationCreate } from '../types/notification-create'
import { EventService } from 'src/events/event.service'
import { EventAttendeesRecipientStrategy } from '../strategies/event-attendees.strategy'
import { Inject, Injectable, forwardRef } from '@nestjs/common'

@Injectable()
export class EventCancelledNotificationFactory extends NotificationFactory {
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
      type: NotificationType.EVENT_CANCELLED,
      link
    }
  }

  protected getMessageTemplate(): string {
    return '{{recipient}} cancelled the event {{entity}}'
  }

  protected getLink(groupId: string, eventId: string): string {
    return `/groups${groupId}/events/${eventId}`
  }
}
