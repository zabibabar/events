import { Types } from 'mongoose'
import { NotificationType } from '../enums/notification-type.enum'
import { Sender } from '../interfaces/sender.interface'
import { NotificationFactory } from './notification.factory'
import { NotificationCreate } from '../types/notification-create'
import { GroupService } from 'src/groups/group.service'
import { GroupMembersRecipientStrategy } from '../strategies/group-members.strategy'
import { Inject, Injectable, forwardRef } from '@nestjs/common'

@Injectable()
export class GroupDeletedNotificationFactory extends NotificationFactory {
  constructor(@Inject(forwardRef(() => GroupService)) groupService: GroupService) {
    super(new GroupMembersRecipientStrategy(groupService))
  }

  async createNotification(
    entityId: Types.ObjectId,
    senders: Sender[]
  ): Promise<NotificationCreate> {
    const recipients = await this.recipientStrategy.getRecipients(entityId.toJSON())
    const link = this.getLink()

    return {
      recipients,
      senders,
      entityId,
      entityModel: 'Group',
      type: NotificationType.GROUP_DELETED,
      link
    }
  }

  protected getMessageTemplate(): string {
    return '{{recipient}} deleted the group {{entity}}'
  }

  protected getLink(): string {
    return ``
  }
}
