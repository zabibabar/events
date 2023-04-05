import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { GroupMemberService } from '../group-member.service'
import { UserIdByExternalIdPipe } from 'src/users/pipes/user-id-by-external-id.pipe'

@Injectable()
export class OrganizerGuard implements CanActivate {
  constructor(
    private groupMemberService: GroupMemberService,
    private userIdByExternalIdPipe: UserIdByExternalIdPipe
  ) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const groupId = request.params.id
    const externalUserId = request.user.sub

    return this.userIdByExternalIdPipe
      .transform(externalUserId)
      .then((userId) => this.groupMemberService.isGroupOrganizer(groupId, userId))
  }
}
