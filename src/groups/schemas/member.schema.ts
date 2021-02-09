import { Schema, Document } from 'mongoose'
import { USER_COLLECTION_NAME } from 'src/users/schemas/user.schema'

export const MemberSchema = new Schema(
  {
    member: {
      type: Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME,
      required: true,
      unique: true
    },
    muted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: { createdAt: true }, _id: false }
)

export interface MemberDocument extends Document {
  member: string
  muted: boolean
}
