import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { NOTIFICATION_COLLECTION_NAME, NotificationDocument } from './schemas/notification.schema'
import { Notification } from './interfaces/notification.interface'
import { NotificationQueryParamDTO } from './dto/notification-query-param.dto'
import { NotificationType } from './enums/notification-type.enum'

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(NOTIFICATION_COLLECTION_NAME)
    private readonly NotificationModel: Model<NotificationDocument>
  ) {}

  async getNotifications(
    userId: string,
    queryParams: NotificationQueryParamDTO
  ): Promise<Notification[]> {
    const filterQuery = this.getFilterQueryFromQueryParams(queryParams)

    return this.NotificationModel.find({ recipientId: userId, ...filterQuery })
      .limit(queryParams.limit)
      .skip(queryParams.skip)
      .exec()
  }

  async getNotificationCount(
    userId: string,
    queryParams: NotificationQueryParamDTO
  ): Promise<number> {
    const filterQuery = this.getFilterQueryFromQueryParams(queryParams)

    return this.NotificationModel.count({ recipientId: userId, ...filterQuery }).exec()
  }

  private getFilterQueryFromQueryParams(
    queryParams: NotificationQueryParamDTO
  ): FilterQuery<NotificationDocument> {
    const { isRead, groupId, eventId, currentDate } = queryParams
    const filterQuery: FilterQuery<NotificationDocument> = {}

    if (isRead) filterQuery.readAt = { $lt: currentDate }
    if (isRead === false) filterQuery.readAt = undefined
    if (groupId) filterQuery.groupId = groupId
    else if (eventId) filterQuery.eventId = eventId

    return filterQuery
  }

  async createNotification(type: NotificationType): Promise<void> {
    await this.createNotificationFromType(type).save()
  }

  private createNotificationFromType(type: NotificationType): NotificationDocument {
    // TODO: create factory class with strategies to create notifications
    return new this.NotificationModel()
  }

  async markNotificationAsRead(notificationId: string, currentDate: Date): Promise<Notification> {
    const notificationDoc = await this.NotificationModel.findOneAndUpdate(
      { _id: notificationId },
      { $set: { readAt: currentDate } },
      { new: true }
    ).exec()

    if (!notificationDoc) throw new NotFoundException('Notification not found')

    return notificationDoc.toObject()
  }
}
