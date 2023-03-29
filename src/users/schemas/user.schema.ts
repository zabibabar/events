import { Schema, HydratedDocument } from 'mongoose'
import { User } from '../interfaces/user.interface'

export const UserSchema = new Schema<User>(
  {
    externalId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    picture: { type: String },
    locale: { type: String },
    emailVerified: { type: Boolean, required: true }
  },
  {
    timestamps: false,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret.__v
        delete ret._id
        return ret
      }
    }
  }
)
export type UserDocument = HydratedDocument<User>

export const USER_COLLECTION_NAME = 'User'
