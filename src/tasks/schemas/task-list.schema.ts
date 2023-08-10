import { HydratedDocument, Schema } from 'mongoose'
import { TaskSchema } from './task.schema'
import { TaskList } from '../interfaces/task-list.interface'
import { EVENT_COLLECTION_NAME } from 'src/events/schemas/event.schema'

export type TaskListDocument = HydratedDocument<TaskList>
export const TASK_LIST_COLLECTION_NAME = 'Tasks'

export const TaskListSchema = new Schema<TaskList>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: EVENT_COLLECTION_NAME },
    name: { type: String, required: true },
    tasks: { type: [TaskSchema], default: [], required: true }
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
