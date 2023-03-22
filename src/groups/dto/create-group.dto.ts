import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { Group } from '../interfaces/group.interface'

export class CreateGroupDTO implements Omit<Group, 'id' | 'picture' | 'members' | 'inviteCode'> {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description?: string
}

export class MemberDTO {
  @IsString()
  @IsMongoId()
  id: string

  @IsOptional()
  @IsBoolean()
  muted?: boolean
}
