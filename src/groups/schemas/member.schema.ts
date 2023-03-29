import { Schema, Document } from 'mongoose'
import { USER_COLLECTION_NAME } from 'src/users/schemas/user.schema'

export const MemberSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME,
      required: true
    },
    isOrganizer: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: { createdAt: true, updatedAt: false }, _id: false, toJSON: { virtuals: true } }
)

MemberSchema.virtual('user', {
  ref: USER_COLLECTION_NAME,
  localField: 'id',
  foreignField: '_id',
  justOne: true
})

export interface MemberDocument extends Document {
  id: string
  isOrganizer: boolean
}
