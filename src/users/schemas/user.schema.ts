import { Schema, Document } from 'mongoose'

export const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    externalId: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    picture: { type: String },
    locale: { type: String },
    emailVerified: { type: Boolean, required: true }
  },
  { timestamps: true }
)

export interface UserDocument extends Document {
  id: string
  externalId: string
  name: string
  firstName: string
  lastName: string
  email: string
  picture: string
  locale: string
  emailVerified: boolean
}

export const USER_COLLECTION_NAME = 'User'
