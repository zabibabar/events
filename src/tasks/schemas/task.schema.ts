import { Schema } from 'mongoose'
import { TaskAssignmentSchema } from './task-assignment'
import { Task } from '../interfaces/task.interface'

export const TaskSchema = new Schema<Task>(
  {
    name: { type: String, required: true },
    assignedTo: { type: [TaskAssignmentSchema], default: [], required: true },
    description: { type: String }
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
