import {
  IsArray,
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateEventDTO {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsMongoId()
  group: string

  @IsDate()
  @Type(() => Date)
  timeStart: Date

  @IsDate()
  @Type(() => Date)
  timeEnd: Date

  @IsString()
  @IsOptional()
  description?: string

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AttendeeDTO)
  attendees: AttendeeDTO[] = []

  @IsString()
  @IsNotEmpty()
  address: string

  @IsBoolean()
  isRemote: boolean

  @IsBoolean()
  hasPot: boolean
}

export class AttendeeDTO {
  @IsString()
  @IsMongoId()
  attendee: string

  @IsBoolean()
  going: boolean

  @IsBoolean()
  isOrganizer: boolean
}
