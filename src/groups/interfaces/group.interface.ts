import { Member } from './member.interface'

export interface Group {
  id: string
  name: string
  description?: string
  picture: string
  inviteCode: string
  members: Member[]
}
