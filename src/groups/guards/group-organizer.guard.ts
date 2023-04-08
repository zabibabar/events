import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { GroupMemberService } from '../group-member.service'
import { UserService } from 'src/users/user.service'

@Injectable()
export class GroupOrganizerGuard implements CanActivate {
  constructor(private groupMemberService: GroupMemberService, private userService: UserService) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const groupId = request.params.id
    const externalUserId = request.user.sub

    return this.userService
      .getUserByExternalId(externalUserId)
      .then(({ id }) => this.groupMemberService.isGroupOrganizer(groupId, id.toString()))
  }
}
