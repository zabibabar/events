import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { NOTIFICATION_COLLECTION_NAME, NotificationDocument } from './schemas/notification.schema'
import { Notification } from './interfaces/notification.interface'
import { NotificationQueryParamDTO } from './dto/group-query-param.dto'

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(NOTIFICATION_COLLECTION_NAME)
    private readonly NotificationModel: Model<NotificationDocument>
  ) {}

  async getNotifications(
    userId: string,
    { limit, skip }: NotificationQueryParamDTO
  ): Promise<Notification[]> {
    const notifications = await this.NotificationModel.find({
      recipientId: userId
    })
      .limit(limit)
      .skip(skip)
      .exec()

    return notifications
  }
}
