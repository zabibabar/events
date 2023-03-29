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
  { timestamps: { createdAt: true, updatedAt: false }, _id: false, toJSON: { virtuals: true } }
)

AttendeeSchema.virtual('user', {
  ref: USER_COLLECTION_NAME,
  localField: 'id',
  foreignField: '_id',
  justOne: true
})

export interface AttendeeDocument extends Document {
  id: string
  isGoing: boolean
}
