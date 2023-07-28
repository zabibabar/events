import { Types } from 'mongoose'
import { NotificationType } from '../enums/notification-type.enum'
import { Recipient } from './recipient.interface'
import { Sender } from './sender.interface'
import { EVENT_COLLECTION_NAME } from 'src/events/schemas/event.schema'
import { GROUP_COLLECTION_NAME } from 'src/groups/schemas/group.schema'

export interface Notification {
  id: Types.ObjectId
  recipients: Recipient[]
  senders: Sender[]
  entityId: Types.ObjectId
  entityModel: typeof EVENT_COLLECTION_NAME | typeof GROUP_COLLECTION_NAME
  type: NotificationType
  // message: string
  link: string
}
