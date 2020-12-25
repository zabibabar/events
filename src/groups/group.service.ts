import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, Member } from './group.model';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel('Group') private readonly groupModel: Model<Group>,
  ) {}

  async getGroups() {
    const groups = await this.groupModel.find().exec();
    return groups.map(({ id, name, description, members }) => ({
      id,
      name,
      description,
      members,
    })) as Group[];
  }

  async createGroup(name: string, description: string, members: Member[] = []) {
    const newGroup = new this.groupModel({ name, description, members });
    return newGroup.save();
  }

  async getGroup(groupdID: string) {
    const group = await this.findGroup(groupdID);
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      members: group.members,
    } as Group;
  }

  async updateGroup(groupdID: string, groupFields: Partial<Group>) {
    delete groupFields.members;
    await this.groupModel
      .updateOne({ _id: groupdID }, { $set: groupFields })
      .exec();
  }

  async deleteGroup(groupID: string) {
    const result = await this.groupModel.deleteOne({ _id: groupID }).exec();
    if (result.n === 0) throw new NotFoundException('Group not found');
  }

  async addGroupMembers(groupdID: string, members: Member[]) {
    await this.groupModel
      .updateOne({ _id: groupdID }, { $push: { members: { $each: members } } })
      .exec();
  }

  async removeGroupMembers(groupdID: string, members: string[]) {
    await this.groupModel
      .updateOne(
        { _id: groupdID },
        { $pull: { members: { id: { $in: members } } } },
      )
      .exec();
  }

  private async findGroup(groupdID: string) {
    let group;
    try {
      group = await this.groupModel.findById(groupdID).exec();
    } catch {
      throw new NotFoundException('Group not found');
    } finally {
      if (!group) {
        throw new NotFoundException('Group not found');
      }
      return group as Group;
    }
  }
}
