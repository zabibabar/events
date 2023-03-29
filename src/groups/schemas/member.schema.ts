import { Schema, HydratedDocument } from 'mongoose'
import { USER_COLLECTION_NAME } from 'src/users/schemas/user.schema'
import { Member } from '../interfaces/member.interface'

export const MemberSchema = new Schema<Member>(
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

export type MemberDocument = HydratedDocument<Member>
