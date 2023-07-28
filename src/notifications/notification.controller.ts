import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { UserExternalId } from 'src/users/decorators/user-external-id.decorator'
import { UserIdByExternalIdPipe } from 'src/users/pipes/user-id-by-external-id.pipe'
import { Notification } from './interfaces/notification.interface'
import { NotificationQueryParamDTO } from './dto/notification-query-param.dto'
import { NotificationService } from './notification.service'
import { MongoIdParams } from 'src/shared/dto/mongo-id-params.dto'

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  getNotifications(
    @UserExternalId(UserIdByExternalIdPipe) userId: string,
    @Query() query: NotificationQueryParamDTO
  ): Promise<Notification[]> {
    return this.notificationService.getNotifications(userId, query)
  }

  @Post(':id')
  changeNotificationReadStatus(
    @UserExternalId(UserIdByExternalIdPipe) userId: string,
    @Param() { id }: MongoIdParams,
    @Body() body: { isRead: boolean }
  ): Promise<Notification> {
    return this.notificationService.changeNotificationReadStatus(id, userId, body.isRead)
  }
}
