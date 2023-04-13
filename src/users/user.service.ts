import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { UserDocument, USER_COLLECTION_NAME } from './schemas/user.schema'
import { User } from './interfaces/user.interface'
import { CreateUserDTO } from './dto/create-user.dto'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_COLLECTION_NAME) private readonly UserModel: Model<UserDocument>,
    private cloudinary: CloudinaryService
  ) {}

  async createUser({ picture, ...user }: CreateUserDTO): Promise<User> {
    const existingUser = await this.UserModel.findOne({ externalId: user.externalId }).exec()
    if (existingUser !== null) return existingUser.toJSON() as User

    const userDoc = new this.UserModel(user)
    const newUser = this.convertUserDocumentToUser(await userDoc.save())

    if (!picture) return newUser

    const profilePic = await this.uploadUserPicture(newUser.id.toString(), picture)
    return this.updateUser(newUser.id.toString(), { picture: profilePic })
  }

  getUserById(userId: string): Promise<User> {
    return this.findUser(userId)
  }

  getUserByExternalId(externalId: string): Promise<User> {
    return this.findUser(externalId, true)
  }

  async updateUser(userId: string, userFields: Partial<User>): Promise<User> {
    const userDoc = await this.UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true }
    ).exec()

    return this.convertUserDocumentToUser(userDoc)
  }

  async deleteUser(userId: string): Promise<void> {
    const result = await this.UserModel.deleteOne({ _id: userId }).exec()
    if (result.deletedCount === 0) throw new NotFoundException('User not found')
  }

  async uploadUserPicture(userId: string, file: Express.Multer.File | string): Promise<string> {
    try {
      const { secure_url } = await this.cloudinary.uploadImage(file, {
        folder: `users/${userId}`,
        public_id: 'profile',
        overwrite: true
      })
      return (await this.updateUser(userId, { picture: secure_url })).picture
    } catch (err) {
      throw new BadRequestException('Invalid file type.')
    }
  }

  private async findUser(id: string, externalId = false): Promise<User> {
    let userDoc: UserDocument | null = null
    try {
      if (externalId) userDoc = await this.UserModel.findOne({ externalId: id }).exec()
      else userDoc = await this.UserModel.findById(id).exec()
    } catch {
      throw new NotFoundException('User not found')
    } finally {
      return this.convertUserDocumentToUser(userDoc)
    }
  }

  private convertUserDocumentToUser(userDoc: UserDocument | null): User {
    if (!userDoc) throw new NotFoundException('User not found')
    return userDoc.toJSON()
  }
}
