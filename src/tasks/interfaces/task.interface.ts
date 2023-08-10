import { TaskAssignment } from './task-assignment.interface'

export interface Task {
  name: string
  assignedTo: TaskAssignment[]
  description?: string
}
