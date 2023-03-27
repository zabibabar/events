import { IsString, IsMongoId, IsBoolean } from 'class-validator'

export class MemberDTO {
  @IsString()
  @IsMongoId()
  id: string

  @IsBoolean()
  isOrganizer: boolean
}
