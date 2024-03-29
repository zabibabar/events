import { Schema, HydratedDocument } from 'mongoose'
import { EVENT_COLLECTION_NAME } from 'src/events/schemas/event.schema'
import { GROUP_COLLECTION_NAME } from 'src/groups/schemas/group.schema'
import { USER_COLLECTION_NAME } from 'src/users/schemas/user.schema'
import { PostCommentSchema } from './post-comment.schema'

export const PostSchema = new Schema(
  {
    createdById: { type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME, required: true },
    sourceId: { type: Schema.Types.ObjectId, required: true, refPath: 'sourceModel' },
    sourceModel: {
      type: String,
      required: true,
      enum: [EVENT_COLLECTION_NAME, GROUP_COLLECTION_NAME]
    },
    body: { type: String, required: true },
    comments: { type: [PostCommentSchema], default: [] },
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME }],
      default: []
    }
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

PostSchema.virtual('createdBy', {
  ref: USER_COLLECTION_NAME,
  localField: 'createdById',
  foreignField: '_id',
  justOne: true
})
