import { IsDate, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateEventDTO {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsMongoId()
  groupId: string

  @IsDate()
  @Type(() => Date)
  timeStart: Date

  @IsDate()
  @Type(() => Date)
  timeEnd: Date

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsNotEmpty()
  address: string
}
