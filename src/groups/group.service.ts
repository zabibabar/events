import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { GroupDocument, GROUP_COLLECTION_NAME } from './schemas/group.schema'
import { Group } from './interfaces/group.interface'
import { Member } from './interfaces/member.interface'
import { CreateGroupDTO } from './dto/create-group.dto'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(GROUP_COLLECTION_NAME) private readonly GroupModel: Model<GroupDocument>,
    private cloudinary: CloudinaryService
  ) {}

  async getGroups(userId: string): Promise<Group[]> {
    const groups = await this.GroupModel.find({
      members: { $elemMatch: { id: userId } }
    }).exec()

    return groups.map((group) => this.convertGroupDocumentToGroup(group))
  }

  async createGroup(group: CreateGroupDTO, userId: string): Promise<Group> {
    const newGroup = new this.GroupModel({
      ...group,
      inviteCode: new Types.ObjectId().toString(),
      members: [{ id: userId, isOrganizer: true }]
    })
    return this.convertGroupDocumentToGroup(await newGroup.save())
  }

  async getGroup(groupId: string): Promise<Group> {
    let groupDoc: GroupDocument | null = null
    try {
      groupDoc = await this.GroupModel.findById(groupId)
        .populate({
          path: 'members.user',
          select: 'name picture'
        })
        .exec()
    } catch {
      throw new NotFoundException('Group not found')
    } finally {
      if (!groupDoc) throw new NotFoundException('Group not found')
      return this.convertGroupDocumentToGroup(groupDoc)
    }
  }

  async updateGroup(groupId: string, groupFields: Partial<Group>): Promise<Group> {
    delete groupFields.members
    const groupDocument = await this.GroupModel.findOneAndUpdate(
      { _id: groupId },
      { $set: groupFields },
      { new: true }
    ).exec()

    return this.convertGroupDocumentToGroup(groupDocument)
  }

  async deleteGroup(groupId: string): Promise<void> {
    const result = await this.GroupModel.deleteOne({ _id: groupId }).exec()
    if (result.deletedCount === 0) throw new NotFoundException('Group not found')
  }

  async getGroupMembers(groupId: string): Promise<Member[]> {
    return (await this.getGroup(groupId)).members
  }

  async uploadGroupPicture(groupId: string, file: Express.Multer.File): Promise<string> {
    try {
      const { secure_url } = await this.cloudinary.uploadImage(file, {
        folder: `groups/${groupId}`,
        public_id: 'thumbnail',
        overwrite: true
      })
      return (await this.updateGroup(groupId, { picture: secure_url })).picture
    } catch (err) {
      throw new BadRequestException('Invalid file type.')
    }
  }

  async addToGroupViaInviteCode(inviteCode: string, userId: string): Promise<Group> {
    const groupDocument = await this.GroupModel.findOneAndUpdate(
      { inviteCode, 'members.id': { $ne: userId } },
      { $push: { members: { id: userId, isOrganizer: false } } },
      { new: true }
    ).exec()

    return this.convertGroupDocumentToGroup(groupDocument)
  }

  async addGroupMembers(groupId: string, userId: string): Promise<Member[]> {
    const groupDocument = await this.GroupModel.findOneAndUpdate(
      { _id: groupId, 'members.id': { $ne: userId } },
      { $push: { members: { id: userId, isOrganizer: false } } },
      { new: true }
    ).exec()

    return this.convertGroupDocumentToGroup(groupDocument).members
  }

  async removeGroupMember(groupId: string, userId: string): Promise<void> {
    await this.GroupModel.updateOne({ _id: groupId }, { $pull: { members: { id: userId } } }).exec()
    return
  }

  async isGroupMember(groupId: string, userId: string): Promise<boolean> {
    const groupMembers = await this.getGroupMembers(groupId)
    return groupMembers.some(({ id }) => id.equals(userId))
  }

  private convertGroupDocumentToGroup(groupDoc: GroupDocument | null): Group {
    if (!groupDoc) {
      throw new NotFoundException('Group not found')
    }
    return groupDoc.toJSON()
  }
}
