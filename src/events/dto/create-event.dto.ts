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
  @IsMongoId()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsDate()
  timeStart: Date

  @IsDate()
  timeEnd: Date

  @IsString()
  @IsOptional()
  description?: string

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AttendeeDTO)
  attendees?: AttendeeDTO[]

  @IsString()
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
