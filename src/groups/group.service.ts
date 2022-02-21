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

  async getGroups(): Promise<Group[]> {
    const group = await this.GroupModel.find()
      .populate({
        path: 'members.member',
        model: 'User'
      })
      .exec()
    return group.map(({ id, name, description, members }) => ({
      id,
      name,
      description,
      members
    }))
  }

  async createGroup({ name, description, members }: CreateGroupDTO): Promise<Group> {
    const newGroup = new this.GroupModel({ name, description, members })
    return newGroup.save()
  }

  async getGroup(groupID: string): Promise<Group> {
    const group = await this.findGroup(groupID)
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      members: group.members
    }
  }

  async updateGroup(groupID: string, groupFields: UpdateGroupDTO): Promise<void> {
    // TODO: delete groupFields.members
    await this.GroupModel.updateOne({ _id: groupID }, { $set: groupFields }).exec()
  }

  async deleteGroup(groupID: string): Promise<void> {
    const result = await this.GroupModel.deleteOne({ _id: groupID }).exec()
    if (result.n === 0) throw new NotFoundException('Group not found')
  }

  async addGroupMembers(groupID: string, members: Member[]): Promise<void> {
    await this.GroupModel.updateOne(
      { _id: groupID },
      { $push: { members: { $each: members } } }
    ).exec()
  }

  async removeGroupMembers(groupID: string, members: string[]): Promise<void> {
    await this.GroupModel.updateOne(
      { _id: groupID },
      { $pull: { members: { member: { $in: members } } } }
    ).exec()
  }

  private async findGroup(groupID: string): Promise<GroupDocument> {
    let group: GroupDocument | null = null
    try {
      group = await this.GroupModel.findById(groupID).exec()
    } catch {
      throw new NotFoundException('Group not found')
    } finally {
      if (!group) {
        throw new NotFoundException('Group not found')
      }
      return group
    }
  }
}
