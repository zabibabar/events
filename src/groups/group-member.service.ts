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
      .populate({
        path: 'members.user',
        select: 'name picture'
      })
      .exec()
    return this.validateGroupAndReturnMembers(groupDocument)
  }

  async addGroupMember(groupId: string, userId: string): Promise<Member[]> {
    const groupDocument = await this.GroupModel.findOneAndUpdate(
      { _id: groupId, 'members.id': { $ne: userId } },
      { $push: { members: { id: userId, isOrganizer: false } } },
      { new: true }
    )
      .populate({
        path: 'members.user',
        select: 'name picture'
      })
      .exec()

    return this.validateGroupAndReturnMembers(groupDocument)
  }

  async removeGroupMember(
    groupId: string,
    memberId: string,
    currentUserId: string
  ): Promise<Member[]> {
    const isRemovingSelf = memberId === currentUserId

    if (!isRemovingSelf) {
      const isCurrentUserGroupOrganizer = await this.isGroupOrganizer(groupId, currentUserId)
      if (!isCurrentUserGroupOrganizer)
        throw new BadRequestException('User does not have access to remove member from group')

      const isMemberGroupOrganizer = await this.isGroupOrganizer(groupId, memberId)
      if (isMemberGroupOrganizer)
        throw new BadRequestException('You cannot remove an organizer from the group')
    }

    const group = await this.GroupModel.findById(groupId, 'organizerCount').exec()

    if (isRemovingSelf && group?.organizersCount === 1)
      throw new BadRequestException(
        'You cannot remove yourself if you are the only organizer left in the group.'
      )

    const groupWithDeletedMember = await this.GroupModel.findOneAndUpdate(
      { _id: groupId },
      { $pull: { members: { id: memberId } } }
    )
      .populate({
        path: 'members.user',
        select: 'name picture'
      })
      .exec()

    return this.validateGroupAndReturnMembers(groupWithDeletedMember)
  }

  async isGroupMember(groupId: string, memberId: string): Promise<boolean> {
    const groupMembers = await this.getGroupMembers(groupId)
    return groupMembers.some(({ id }) => id.equals(memberId))
  }

  async isGroupOrganizer(groupId: string, memberId: string): Promise<boolean> {
    const groupMembers = await this.getGroupMembers(groupId)
    return groupMembers.some(({ id, isOrganizer }) => id.equals(memberId) && isOrganizer)
  }

  async makeGroupOrganizer(groupId: string, memberId: string): Promise<Member[]> {
    const groupDoc = await this.GroupModel.findOneAndUpdate(
      { _id: groupId, 'members.id': memberId },
      { $set: { 'members.$.isOrganizer': true } },
      { new: true }
    )
      .populate({
        path: 'members.user',
        select: 'name picture'
      })
      .exec()

    return this.validateGroupAndReturnMembers(groupDoc)
  }

  async removeGroupOrganizer(
    groupId: string,
    memberId: string,
    currentUserId: string
  ): Promise<Member[]> {
    if (memberId !== currentUserId)
      throw new BadRequestException('You can only remove yourself as an organizer!')

    const groupMembers = await this.getGroupMembers(groupId)
    const organizerCount = groupMembers.filter(({ isOrganizer }) => isOrganizer).length
    if (organizerCount === 1)
      throw new BadRequestException(
        'The group has only one organizer. Please make someone else an organizer before removing yourself!'
      )

    const groupDoc = await this.GroupModel.findOneAndUpdate(
      { _id: groupId, 'members.id': memberId },
      { $set: { 'members.$.isOrganizer': false } },
      { new: true }
    )
      .populate({
        path: 'members.user',
        select: 'name picture'
      })
      .exec()

    return this.validateGroupAndReturnMembers(groupDoc)
  }

  private validateGroupAndReturnMembers(group: GroupDocument | null): Member[] {
    if (group === null) throw new NotFoundException('Invalid Group Id')

    return group.members
  }
}
