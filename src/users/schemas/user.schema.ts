import { Schema, Document } from 'mongoose'

export const UsersSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true }
  },
  { timestamps: true }
)

export interface UserDocument extends Document {
  id: string
  firstName: string
  lastName: string
  email: string
}

export const USER_COLLECTION_NAME = 'User'
