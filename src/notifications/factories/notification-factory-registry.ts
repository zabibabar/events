import { NotificationType } from '../enums/notification-type.enum'
import { GroupJoinedNotificationFactory } from './group-joined.factory'
import { NotificationFactory } from './notification.factory'
import { GroupDeletedNotificationFactory } from './group-deleted.factory'
import { EventCreatedNotificationFactory } from './event-created.factory'
import { EventAttendeesUpdatedNotificationFactory } from './event-attendees-updated.factory'
import { EventAttendeesReminderNotificationFactory } from './event-attendees-reminder.factory'
import { EventReminderNotificationFactory } from './event-reminder.factory'
import { EventCancelledNotificationFactory } from './event-cancelled.factory'
import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

@Injectable()
export class NotificationFactoryRegistry {
  constructor(private moduleRef: ModuleRef) {}

  getNotificationFactory(notificationType: NotificationType): NotificationFactory {
    switch (notificationType) {
      case NotificationType.GROUP_JOINED:
        return this.moduleRef.get(GroupJoinedNotificationFactory)
      case NotificationType.GROUP_DELETED:
        return this.moduleRef.get(GroupDeletedNotificationFactory)
      case NotificationType.EVENT_REMINDER:
        return this.moduleRef.get(EventReminderNotificationFactory)
      case NotificationType.EVENT_CREATED:
        return this.moduleRef.get(EventCreatedNotificationFactory)
      case NotificationType.EVENT_ATTENDEES_UPDATED:
        return this.moduleRef.get(EventAttendeesUpdatedNotificationFactory)
      case NotificationType.EVENT_ATTENDEES_REMINDER:
        return this.moduleRef.get(EventAttendeesReminderNotificationFactory)
      case NotificationType.EVENT_CANCELLED:
        return this.moduleRef.get(EventCancelledNotificationFactory)
      default:
        throw new Error(`Unknown notification type: ${notificationType}`)
    }
  }
}
