import { Schema, HydratedDocument } from 'mongoose'
import { EVENT_COLLECTION_NAME } from 'src/events/schemas/event.schema'
import { GROUP_COLLECTION_NAME } from 'src/groups/schemas/group.schema'
import { USER_COLLECTION_NAME } from 'src/users/schemas/user.schema'
import { NotificationType } from '../enums/notification-type.enum'
import { Notification } from '../interfaces/notification.interface'

export type NotificationDocument = HydratedDocument<Notification>
export const NOTIFICATION_COLLECTION_NAME = 'Notification'

export const NotificationSchema = new Schema<Notification>(
  {
    recipientId: { type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME, required: true },
    groupId: { type: Schema.Types.ObjectId, ref: GROUP_COLLECTION_NAME },
    eventId: { type: Schema.Types.ObjectId, ref: EVENT_COLLECTION_NAME },
    type: { type: String, enum: NotificationType, required: true },
    readAt: { type: Date }
  },
  {
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret.__v
        delete ret._id
        return ret
      }
    }
  }
)
