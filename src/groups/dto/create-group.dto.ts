import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateGroupDTO {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description?: string
}
