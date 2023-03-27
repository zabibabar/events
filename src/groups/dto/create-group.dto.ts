import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { Group } from '../interfaces/group.interface'

export class CreateGroupDTO implements Omit<Group, 'id' | 'picture' | 'members' | 'inviteCode'> {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description?: string
}
