import { Schema } from 'mongoose'
import { USER_COLLECTION_NAME } from 'src/users/schemas/user.schema'
import { EventTaskSchema } from './event-task.schema'

export const EventTaskListSchema = new Schema(
  {
    createdById: { type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME, required: true },
    name: { type: String, required: true },
    description: { type: String },
    tasks: { type: [EventTaskSchema], default: [] }
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

EventTaskListSchema.virtual('createdBy', {
  ref: USER_COLLECTION_NAME,
  localField: 'createdById',
  foreignField: '_id',
  justOne: true
})
