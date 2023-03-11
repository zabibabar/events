import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { GroupDocument, GROUP_COLLECTION_NAME } from './schemas/group.schema'
import { Group } from './interfaces/group.interface'
import { Member } from './interfaces/member.interface'
import { CreateGroupDTO } from './dto/create-group.dto'
import { UpdateGroupDTO } from './dto/update-group.dto'

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(GROUP_COLLECTION_NAME) private readonly GroupModel: Model<GroupDocument>
  ) {}

  async getGroups(userId: string): Promise<Group[]> {
    const groups = await this.GroupModel.find({
      members: { $elemMatch: { id: userId } }
    }).exec()

    return groups.map((group) => group.toJSON())
  }

  async createGroup(group: CreateGroupDTO, userId: string): Promise<Group> {
    const newGroup = new this.GroupModel({ ...group, members: [{ id: userId }] })
    return this.convertGroupDocumentToGroup(await newGroup.save())
  }

  getGroup(groupId: string): Promise<Group> {
    return this.findGroup(groupId)
  }

  async updateGroup(groupId: string, groupFields: UpdateGroupDTO): Promise<Group> {
    // TODO: delete groupFields.members
    const groupDocument = await this.GroupModel.findOneAndUpdate(
      { _id: groupId },
      { $set: groupFields },
      { new: true }
    ).exec()

    return this.convertGroupDocumentToGroup(groupDocument)
  }

  async deleteGroup(groupId: string): Promise<void> {
    const result = await this.GroupModel.deleteOne({ _id: groupId }).exec()
    if (result.n === 0) throw new NotFoundException('Group not found')
  }

  async getGroupMembers(groupId: string): Promise<Member[]> {
    return (await this.getGroup(groupId)).members
  }

  async addGroupMembers(groupId: string, memberIds: string[]): Promise<Member[]> {
    const groupDocument = await this.GroupModel.findOneAndUpdate(
      { _id: groupId },
      { $addToSet: { members: { $each: memberIds.map((id) => ({ id })) } } },
      { new: true }
    ).exec()

    return this.convertGroupDocumentToGroup(groupDocument).members
  }

  async removeGroupMember(groupId: string, memberId: string): Promise<void> {
    await this.GroupModel.updateOne(
      { _id: groupId },
      { $pull: { members: { id: memberId } } }
    ).exec()
  }

  private async findGroup(groupId: string): Promise<Group> {
    let group: GroupDocument | null = null
    try {
      group = await this.GroupModel.findById(groupId).exec()
    } catch {
      throw new NotFoundException('Group not found')
    } finally {
      return this.convertGroupDocumentToGroup(group)
    }
  }

  private convertGroupDocumentToGroup(groupDoc: GroupDocument | null): Group {
    if (!groupDoc) {
      throw new NotFoundException('Group not found')
    }

    const { id, name, description, members } = groupDoc
    return { id, name, description, members }
  }
}
