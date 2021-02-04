import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { GroupDocument } from './schemas/group.schema'
import { Group } from './interfaces/group.interface'
import { Member } from './interfaces/member.interface'
import { CreateGroupDTO } from './dto/create-group.dto'
import { UpdateGroupDTO } from './dto/update-group.dto'

@Injectable()
export class GroupService {
  constructor(@InjectModel('Group') private readonly GroupModel: Model<GroupDocument>) {}

  async getGroups(): Promise<Group[]> {
    const group = await this.GroupModel.find().exec()
    return group.map(({ id, name, description, members }) => ({
      id,
      name,
      description,
      members
    })) as Group[]
  }

  async createGroup({ name, description, members }: CreateGroupDTO): Promise<Group> {
    const newGroup = new this.GroupModel({ name, description, members })
    return newGroup.save()
  }

  async getGroup(groupdID: string): Promise<Group> {
    const group = await this.findGroup(groupdID)
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      members: group.members
    } as Group
  }

  async updateGroup(groupdID: string, groupFields: UpdateGroupDTO): Promise<void> {
    delete groupFields.members
    await this.GroupModel.updateOne({ _id: groupdID }, { $set: groupFields }).exec()
  }

  async deleteGroup(groupID: string): Promise<void> {
    const result = await this.GroupModel.deleteOne({ _id: groupID }).exec()
    if (result.n === 0) throw new NotFoundException('Group not found')
  }

  async addGroupMembers(groupdID: string, members: Member[]): Promise<void> {
    await this.GroupModel.updateOne(
      { _id: groupdID },
      { $push: { members: { $each: members } } }
    ).exec()
  }

  async removeGroupMembers(groupdID: string, members: string[]): Promise<void> {
    await this.GroupModel.updateOne(
      { _id: groupdID },
      { $pull: { members: { id: { $in: members } } } }
    ).exec()
  }

  private async findGroup(groupdID: string): Promise<GroupDocument> {
    let group: GroupDocument
    try {
      group = await this.GroupModel.findById(groupdID).exec()
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
