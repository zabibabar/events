import { Member } from './member.interface'

export interface Group {
  id: string
  name: string
  inviteCode: string
  description?: string
  members: Member[]
}
