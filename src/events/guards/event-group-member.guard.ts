import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { GroupMemberService } from 'src/groups/group-member.service'
import { UserService } from 'src/users/user.service'
import { EventService } from '../event.service'

@Injectable()
export class EventGroupMemberGuard implements CanActivate {
  constructor(
    private groupMemberService: GroupMemberService,
    private userService: UserService,
    private eventService: EventService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const eventId = request.params.id
    const externalUserId = request.user.sub

    const groupId = (await this.eventService.getEvent(eventId)).groupId.toString()
    return this.userService
      .getUserByExternalId(externalUserId)
      .then(({ id }) => this.groupMemberService.isGroupMember(groupId, id.toString()))
  }
}
