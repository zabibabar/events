import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { GroupDocument, GROUP_COLLECTION_NAME } from './schemas/group.schema'
import { Member } from './interfaces/member.interface'

@Injectable()
export class GroupMemberService {
  constructor(
    @InjectModel(GROUP_COLLECTION_NAME) private readonly GroupModel: Model<GroupDocument>
  ) {}

  async getGroupMembers(groupId: string): Promise<Member[]> {
    const groupDocument = await this.GroupModel.findById(groupId)
    if (!groupDocument) throw new NotFoundException('Group not found')

    return groupDocument.members
  }

  async addGroupMember(groupId: string, userId: string): Promise<Member[]> {
    const groupDocument = await this.GroupModel.findOneAndUpdate(
      { _id: groupId, 'members.id': { $ne: userId } },
      { $push: { members: { id: userId, isOrganizer: false } } },
      { new: true }
    ).exec()

    if (!groupDocument) throw new NotFoundException('Group not found')

    return groupDocument.members
  }

  async isGroupMember(groupId: string, memberId: string): Promise<boolean> {
    const groupMembers = await this.getGroupMembers(groupId)
    return groupMembers.some(({ id }) => id.equals(memberId))
  }

  async removeGroupMember(groupId: string, memberId: string, userId: string): Promise<void> {
    const isUserGroupOrganizer = await this.isGroupOrganizer(groupId, userId)
    if (!isUserGroupOrganizer)
      throw new BadRequestException('User does not have access to remove member from group')

    const isMemberGroupOrganizer = await this.isGroupOrganizer(groupId, memberId)
    if (!isMemberGroupOrganizer)
      throw new BadRequestException('You cannot remove an organizer from the group')

    const isRemovingSelf = memberId === userId
    const group = await this.GroupModel.findById(groupId, 'organizerCount').exec()

    if (isRemovingSelf && group?.organizersCount === 1)
      throw new BadRequestException(
        'You cannot remove yourself if you are the only organizer left in the group.'
      )

    await this.GroupModel.updateOne(
      { _id: groupId },
      { $pull: { members: { id: memberId } } }
    ).exec()
  }

  async isGroupOrganizer(groupId: string, memberId: string): Promise<boolean> {
    const group = await this.GroupModel.findOne({
      _id: groupId,
      members: { $elemMatch: { id: memberId, isOrganizer: true } }
    })
    return group !== null
  }
}
