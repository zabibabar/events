import { Member } from './member.interface'

export interface Group {
  id: string
  name: string
  description?: string
  members?: Member[]
}
