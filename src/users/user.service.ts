import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { UserDocument, USER_COLLECTION_NAME } from './schemas/user.schema'
import { User } from './interfaces/user.interface'
import { CreateUserDTO } from './dto/create-user.dto'
import { UpdateUserDTO } from './dto/update-user.dto'
import { GroupDocument, GROUP_COLLECTION_NAME } from 'src/groups/schemas/group.schema'
import { Group } from 'src/groups/interfaces/group.interface'
import { Event } from 'src/events/interfaces/event.interface'
import { EventDocument, EVENT_COLLECTION_NAME } from 'src/events/schemas/event.schema'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_COLLECTION_NAME) private readonly UserModel: Model<UserDocument>,
    @InjectModel(GROUP_COLLECTION_NAME) private readonly GroupModel: Model<GroupDocument>,
    @InjectModel(EVENT_COLLECTION_NAME) private readonly EventModel: Model<EventDocument>
  ) {}

  async getAllUsers(): Promise<User[]> {
    const users = await this.UserModel.find().exec()
    return users.map((userDoc) => this.convertUserDocumentToUser(userDoc))
  }

  async createUser({ firstName, lastName, email }: CreateUserDTO): Promise<User> {
    const newUser = new this.UserModel({ firstName, lastName, email })
    return this.convertUserDocumentToUser(await newUser.save())
  }

  getUser(userID: string): Promise<User> {
    return this.findUser(userID)
  }

  async updateUser(userID: string, userFields: UpdateUserDTO): Promise<User> {
    const userDoc = await this.UserModel.findOneAndUpdate(
      { _id: userID },
      { $set: userFields },
      { new: true }
    ).exec()

    return this.convertUserDocumentToUser(userDoc)
  }

  async deleteUser(userID: string): Promise<void> {
    const result = await this.UserModel.deleteOne({ _id: userID }).exec()
    if (result.n === 0) throw new NotFoundException('User not found')
  }

  async getGroupsByUser(userId: string): Promise<Group[]> {
    const groups = await this.GroupModel.find({
      members: { $elemMatch: { member: userId } }
    }).exec()

    return groups.map((group) => group.toJSON())
  }

  async getEventsByUser(userId: string): Promise<Event[]> {
    const events = await this.EventModel.find({
      attendees: { $elemMatch: { attendee: userId } }
    }).exec()

    return events.map((event) => event.toJSON())
  }

  private async findUser(userID: string): Promise<User> {
    let userDoc: UserDocument | null = null
    try {
      userDoc = await this.UserModel.findById(userID).exec()
    } catch {
      throw new NotFoundException('User not found')
    } finally {
      return this.convertUserDocumentToUser(userDoc)
    }
  }

  private convertUserDocumentToUser(userDoc: UserDocument | null): User {
    if (!userDoc) throw new NotFoundException('User not found')

    const { id, firstName, lastName, email } = userDoc
    return { id, firstName, lastName, email }
  }
}
