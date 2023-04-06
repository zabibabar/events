import { Types } from 'mongoose'
import { NotificationType } from '../enums/notification-type.enum'

export interface Notification {
  id: Types.ObjectId
  recipientId: Types.ObjectId
  groupId?: Types.ObjectId
  eventId?: Types.ObjectId
  type: NotificationType
  readAt?: Date
}
