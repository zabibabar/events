import { Schema, HydratedDocument } from 'mongoose'
import { EVENT_COLLECTION_NAME } from 'src/events/schemas/event.schema'
import { GROUP_COLLECTION_NAME } from 'src/groups/schemas/group.schema'
import { NotificationType } from '../enums/notification-type.enum'
import { Notification } from '../interfaces/notification.interface'
import { SenderSchema } from './sender.schema'
import { RecipientSchema } from './recipient.schema'

export type NotificationDocument = HydratedDocument<Notification>
export const NOTIFICATION_COLLECTION_NAME = 'Notification'

export const NotificationSchema = new Schema<Notification>(
  {
    recipients: { type: [RecipientSchema], default: [], required: true },
    senders: { type: [SenderSchema], default: [], required: true },
    entityId: { type: Schema.Types.ObjectId, required: true, refPath: 'entityModel' },
    entityModel: {
      type: String,
      required: true,
      enum: [EVENT_COLLECTION_NAME, GROUP_COLLECTION_NAME]
    },
    type: { type: String, enum: NotificationType, required: true },
    // message: { type: String, enum: NotificationType, required: true },
    link: { type: String, enum: NotificationType, required: true }
  },
  {
    toObject: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret.__v
        delete ret._id
        return ret
      }
    }
  }
)
