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

  private async findUser(userID: string): Promise<User> {
    let user: UserDocument | null = null
    try {
      user = await this.UserModel.findById(userID).exec()
    } catch {
      throw new NotFoundException('User not found')
    } finally {
      return this.convertUserDocumentToUser(user)
    }
  }

  private convertUserDocumentToUser(userDoc: UserDocument | null): User {
    if (!userDoc) {
      throw new NotFoundException('User not found')
    }

    const { id, firstName, lastName, email } = userDoc
    return { id, firstName, lastName, email }
  }
}
