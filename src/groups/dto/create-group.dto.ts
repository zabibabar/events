import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateGroupDTO {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  description?: string

  @ValidateNested({ each: true })
  @Type(() => MemberDTO)
  @IsArray()
  @IsOptional()
  members?: MemberDTO[]
}

export class MemberDTO {
  @IsString()
  @IsMongoId()
  member: string

  @IsOptional()
  @IsBoolean()
  muted?: boolean
}
