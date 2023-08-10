import { Types } from 'mongoose'

export interface TaskAssignment {
  userId: Types.ObjectId
  notes?: string
}
