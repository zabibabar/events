import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from './models/user.model'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly UserModel: Model<User>) {}

  async getAllUsers() {
    const users = await this.UserModel.find().exec()
    return users.map(({ id, firstName, lastName, email }) => ({
      id,
      firstName,
      lastName,
      email
    })) as User[]
  }

  async createUser({ firstName, lastName, email }: CreateUserDto) {
    const newUser = new this.UserModel({ firstName, lastName, email })
    return newUser.save()
  }

  async getUser(userdID: string) {
    const user = await this.findUser(userdID)
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    } as User
  }

  async updateUser(userID: string, userFields: UpdateUserDto) {
    await this.UserModel.updateOne({ _id: userID }, { $set: userFields }).exec()
  }

  async deleteUser(userID: string) {
    const result = await this.UserModel.deleteOne({ _id: userID }).exec()
    if (result.n === 0) throw new NotFoundException('User not found')
  }

  private async findUser(userdID: string) {
    let user
    try {
      user = await this.UserModel.findById(userdID).exec()
    } catch {
      throw new NotFoundException('User not found')
    } finally {
      if (!user) {
        throw new NotFoundException('User not found')
      }
      return user as User
    }
  }
}
