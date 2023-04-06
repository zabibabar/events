import { Schema } from 'mongoose'
import { USER_COLLECTION_NAME } from 'src/users/schemas/user.schema'

export const PostCommentSchema = new Schema(
  {
    createdById: { type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME, required: true },
    body: { type: String, required: true }
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
  localField: 'createdById',
  foreignField: '_id',
  justOne: true
})
