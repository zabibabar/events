import { Types } from 'mongoose'

export interface Recipient {
  id: Types.ObjectId
  isRead: boolean
}
