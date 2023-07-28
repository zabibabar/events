import { Types } from 'mongoose'
import { NotificationType } from '../enums/notification-type.enum'
import { Sender } from '../interfaces/sender.interface'
import { NotificationFactory } from './notification.factory'
import { NotificationCreate } from '../types/notification-create'
import { EventService } from 'src/events/event.service'
import { GroupService } from 'src/groups/group.service'
import { GroupMembersRecipientStrategy } from '../strategies/group-members.strategy'
import { Inject, Injectable, forwardRef } from '@nestjs/common'

@Injectable()
export class EventReminderNotificationFactory extends NotificationFactory {
  constructor(
    @Inject(forwardRef(() => GroupService)) groupService: GroupService,
    @Inject(forwardRef(() => EventService)) private eventService: EventService
  ) {
    super(new GroupMembersRecipientStrategy(groupService))
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
      type: NotificationType.EVENT_REMINDER,
      link
    }
  }

  protected getMessageTemplate(): string {
    return 'Reminder: The event {{entity}} is coming up!'
  }

  protected getLink(groupId: string, eventId: string): string {
    return `/groups${groupId}/events/${eventId}`
  }
}
