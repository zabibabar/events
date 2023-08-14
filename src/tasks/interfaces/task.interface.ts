import { Types } from 'mongoose'
import { TaskAssignment } from './task-assignment.interface'

export interface Task {
  id: Types.ObjectId
  name: string
  assignedTo: TaskAssignment[]
  description?: string
}
