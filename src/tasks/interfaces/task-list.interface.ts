import { Types } from 'mongoose'
import { Task } from './task.interface'

export interface TaskList {
  eventId: Types.ObjectId
  name: string
  tasks: Task[]
}
