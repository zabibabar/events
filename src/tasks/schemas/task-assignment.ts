import { Schema } from 'mongoose'
import { USER_COLLECTION_NAME } from 'src/users/schemas/user.schema'
import { TaskAssignment } from '../interfaces/task-assignment.interface'

export const TaskAssignmentSchema = new Schema<TaskAssignment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME },
    notes: { type: String }
  },
  {
    _id: false,
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

TaskAssignmentSchema.virtual('user', {
  ref: USER_COLLECTION_NAME,
  localField: 'userId',
  foreignField: '_id',
  justOne: true
})