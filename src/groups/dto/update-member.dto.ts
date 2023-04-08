import { IsBoolean } from 'class-validator'

export class MemberDTO {
  @IsBoolean()
  isOrganizer: boolean
}
