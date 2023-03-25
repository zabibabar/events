import { Schema, Document } from 'mongoose'
import { USER_COLLECTION_NAME } from 'src/users/schemas/user.schema'

export const AttendeeSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME,
      required: true,
      unique: true
    },
    isGoing: Boolean
  },
  { timestamps: { createdAt: true }, _id: false }
)

export interface AttendeeDocument extends Document {
  id: string
  isGoing: boolean
}
