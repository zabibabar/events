import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { UserDocument, USER_COLLECTION_NAME } from './schemas/user.schema'
import { User } from './interfaces/user.interface'
import { CreateUserDTO } from './dto/create-user.dto'
import { UpdateUserDTO } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(@InjectModel(USER_COLLECTION_NAME) private readonly UserModel: Model<UserDocument>) {}

  async createUser(user: CreateUserDTO): Promise<User> {
    const newUser = new this.UserModel(user)
    return this.convertUserDocumentToUser(await newUser.save())
  }

  getUserByExternalId(externalId: string): Promise<User> {
    return this.findUser(externalId)
  }

  async updateUser(userId: string, userFields: UpdateUserDTO): Promise<User> {
    const userDoc = await this.UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true }
    ).exec()

    return this.convertUserDocumentToUser(userDoc)
  }

  async deleteUser(userId: string): Promise<void> {
    const result = await this.UserModel.deleteOne({ _id: userId }).exec()
    if (result.n === 0) throw new NotFoundException('User not found')
  }

  private async findUser(externalId: string): Promise<User> {
    let userDoc: UserDocument | null = null
    try {
      ;[userDoc] = await this.UserModel.find({ externalId }).exec()
    } catch {
      throw new NotFoundException('User not found')
    } finally {
      return this.convertUserDocumentToUser(userDoc)
    }
  }

  private convertUserDocumentToUser(userDoc: UserDocument | null): User {
    if (!userDoc) throw new NotFoundException('User not found')

    const {
      id,
      externalId,
      firstName,
      lastName,
      email,
      locale,
      emailVerified,
      name,
      picture
    } = userDoc
    return { id, externalId, firstName, lastName, email, locale, emailVerified, name, picture }
  }
}
