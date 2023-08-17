import { Schema } from 'mongoose'
import { USER_COLLECTION_NAME } from 'src/users/schemas/user.schema'
import { LikeSchema } from './like.schema'

export const PostCommentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME, required: true },
    body: { type: String, required: true },
    likes: { type: [LikeSchema], default: [] }
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

PostCommentSchema.virtual('createdBy', {
  ref: USER_COLLECTION_NAME,
  localField: 'userId',
  foreignField: '_id',
  justOne: true
})
