import { Member } from '../interfaces/member.interface'

export class CreateGroupDTO {
  name: string
  description: string
  members: Member
}
