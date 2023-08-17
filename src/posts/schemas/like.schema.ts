import { Schema } from 'mongoose'
import { USER_COLLECTION_NAME } from 'src/users/schemas/user.schema'

export const LikeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME, required: true }
  },
  {
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

LikeSchema.virtual('createdBy', {
  ref: USER_COLLECTION_NAME,
  localField: 'userId',
  foreignField: '_id',
  justOne: true
})
