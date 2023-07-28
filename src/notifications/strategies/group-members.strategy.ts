import { RecipientStrategy } from '../interfaces/recipient-strategy.interface'
import { Recipient } from '../interfaces/recipient.interface'
import { GroupService } from 'src/groups/group.service'

export class GroupMembersRecipientStrategy implements RecipientStrategy {
  constructor(private groupService: GroupService) {}

  async getRecipients(entityId: string): Promise<Recipient[]> {
    const group = await this.groupService.getGroup(entityId)
    if (!group) {
      throw new Error(`Group with id ${entityId} not found`)
    }
    return group.members.map(({ id }) => ({ id, isRead: false }))
  }
}
