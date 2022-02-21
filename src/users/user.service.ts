import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { UserDocument, USER_COLLECTION_NAME } from './schemas/user.schema'
import { User } from './interfaces/user.interface'
import { CreateUserDTO } from './dto/create-user.dto'
import { UpdateUserDTO } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(@InjectModel(USER_COLLECTION_NAME) private readonly UserModel: Model<UserDocument>) {}

  async getAllUsers(): Promise<User[]> {
    const users = await this.UserModel.find().exec()
    return users.map(({ id, firstName, lastName, email }) => ({
      id,
      firstName,
      lastName,
      email
    })) as User[]
  }

  async createUser({ firstName, lastName, email }: CreateUserDTO): Promise<User> {
    const newUser = new this.UserModel({ firstName, lastName, email })
    return newUser.save()
  }

  async getUser(userID: string): Promise<User> {
    const user = await this.findUser(userID)
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    } as User
  }

  async updateUser(userID: string, userFields: UpdateUserDTO): Promise<void> {
    await this.UserModel.updateOne({ _id: userID }, { $set: userFields }).exec()
  }

  async deleteUser(userID: string): Promise<void> {
    const result = await this.UserModel.deleteOne({ _id: userID }).exec()
    if (result.n === 0) throw new NotFoundException('User not found')
  }

  private async findUser(userID: string): Promise<UserDocument> {
    let user: UserDocument | null = null
    try {
      user = await this.UserModel.findById(userID).exec()
    } catch {
      throw new NotFoundException('User not found')
    } finally {
      if (!user) {
        throw new NotFoundException('User not found')
      }
      return user
    }
  }
}
