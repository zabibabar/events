import { Types } from 'mongoose'
import { Sender } from '../interfaces/sender.interface'
import { NotificationCreate } from '../types/notification-create'
import { RecipientStrategy } from '../interfaces/recipient-strategy.interface'

export abstract class NotificationFactory {
  constructor(protected recipientStrategy: RecipientStrategy) {}

  abstract createNotification(
    entityId: Types.ObjectId,
    senders: Sender[]
  ): Promise<NotificationCreate>

  protected abstract getMessageTemplate(): string
  protected abstract getLink(...rest: string[]): string
}
