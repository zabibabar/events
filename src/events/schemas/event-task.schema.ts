import { Schema } from 'mongoose'
import { USER_COLLECTION_NAME } from 'src/users/schemas/user.schema'

export const EventTaskSchema = new Schema(
  {
    createdById: { type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME, required: true },
    name: { type: String, required: true },
    description: { type: String },
    link: { type: String },
    isDone: { type: Boolean, default: false },
    quantity: { type: Number, default: 1, min: 1 },
    doneByIds: {
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

EventTaskSchema.virtual('createdBy', {
  ref: USER_COLLECTION_NAME,
  localField: 'createdById',
  foreignField: '_id',
  justOne: true
})

EventTaskSchema.virtual('createdBy', {
  ref: USER_COLLECTION_NAME,
  localField: 'doneByIds',
  foreignField: '_id'
})
