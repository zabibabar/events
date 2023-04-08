import { Controller, Get, Query } from '@nestjs/common'
import { UserExternalId } from 'src/users/decorators/user-external-id.decorator'
import { UserIdByExternalIdPipe } from 'src/users/pipes/user-id-by-external-id.pipe'
import { Notification } from './interfaces/notification.interface'
import { NotificationQueryParamDTO } from './dto/notification-query-param.dto'
import { NotificationService } from './notification.service'

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

  getNotificationCount(
    @UserExternalId(UserIdByExternalIdPipe) userId: string,
    @Query() query: NotificationQueryParamDTO
  ): Promise<number> {
    return this.notificationService.getNotificationCount(userId, query)
  }
}
