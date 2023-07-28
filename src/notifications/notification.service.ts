import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { NOTIFICATION_COLLECTION_NAME, NotificationDocument } from './schemas/notification.schema'
import { Notification } from './interfaces/notification.interface'
import { NotificationQueryParamDTO } from './dto/notification-query-param.dto'
import { NotificationType } from './enums/notification-type.enum'
import { Sender } from './interfaces/sender.interface'
import { NotificationFactoryRegistry } from './factories/notification-factory-registry'

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(NOTIFICATION_COLLECTION_NAME)
    private NotificationModel: Model<NotificationDocument>,
    private notificationFactoryRegistry: NotificationFactoryRegistry
  ) {}

  async getNotifications(
    userId: string,
    { limit, skip, isRead }: NotificationQueryParamDTO
  ): Promise<Notification[]> {
    return this.NotificationModel.find({ recipientId: userId, isRead })
      .limit(limit)
      .skip(skip)
      .exec()
  }

  async createNotification(
    notificationType: NotificationType,
    entityId: Types.ObjectId,
    senders: Sender[] = []
  ): Promise<Notification> {
    const factory = this.notificationFactoryRegistry.getNotificationFactory(notificationType)
    const notification = await factory.createNotification(entityId, senders)
    return this.NotificationModel.create(notification)
  }

  async changeNotificationReadStatus(
    notificationId: string,
    userId: string,
    isRead: boolean
  ): Promise<Notification> {
    const notificationDoc = await this.NotificationModel.findOneAndUpdate(
      { _id: notificationId, 'recipient.id': userId },
      { $set: { 'recipient.$.isRead': isRead } },
      { new: true }
    ).exec()

    if (!notificationDoc) throw new NotFoundException('Notification not found')

    return notificationDoc.toObject()
  }
}
