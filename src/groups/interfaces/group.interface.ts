import { Types } from 'mongoose'
import { Member } from './member.interface'

export interface Group {
  id: Types.ObjectId
  name: string
  description?: string
  picture: string
  inviteCode: string
  members: Member[]
}
