import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { GroupDocument, GROUP_COLLECTION_NAME } from './schemas/group.schema'
import { Group } from './interfaces/group.interface'
import { CreateGroupDTO } from './dto/create-group.dto'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'
import { EventService } from 'src/events/event.service'
import { GroupQueryParamDTO } from './dto/group-query-param.dto'

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(GROUP_COLLECTION_NAME) private readonly GroupModel: Model<GroupDocument>,
    @Inject(forwardRef(() => EventService)) private eventService: EventService,
    private cloudinary: CloudinaryService
  ) {}

  async getGroupsByUserId(
    userId: string,
    { limit, skip }: GroupQueryParamDTO = { limit: 0, skip: 0 }
  ): Promise<Group[]> {
    const groups = await this.GroupModel.find({
      members: { $elemMatch: { id: userId } }
    })
      .limit(limit)
      .skip(skip)
      .exec()

    return groups.map((group) => this.convertGroupDocumentToGroup(group))
  }

  async createGroup(group: CreateGroupDTO, userId: string): Promise<Group> {
    const newGroup = new this.GroupModel({
      ...group,
      inviteCode: new Types.ObjectId().toString(),
      picture: 'https://res.cloudinary.com/dmtvchdf2/image/upload/v1680403970/Groups/default.webp',
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
    )
      .populate({
        path: 'members.user',
        select: 'name picture'
      })
      .exec()

    return this.convertGroupDocumentToGroup(groupDocument)
  }

  async deleteGroup(groupId: string, currentDate: Date): Promise<void> {
    const { upcoming } = await this.eventService.getEventCountByGroupId(groupId, currentDate)
    if (upcoming > 0) throw new NotFoundException('Cannot delete group with upcoming events')
    const result = await this.GroupModel.deleteOne({ _id: groupId }).exec()
    if (result.deletedCount === 0) throw new NotFoundException('Group not found')
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

  private convertGroupDocumentToGroup(groupDoc: GroupDocument | null): Group {
    if (!groupDoc) {
      throw new NotFoundException('Group not found')
    }

    return groupDoc.toJSON()
  }
}
