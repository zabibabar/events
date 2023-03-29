import { Types } from 'mongoose'

export interface Member {
  id: Types.ObjectId
  isOrganizer: boolean
}
