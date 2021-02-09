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
  @Type(() => OrganizerDTO)
  organizers: OrganizerDTO[]

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AttendeeDTO)
  attendees?: AttendeeDTO[]

  @IsString()
  address: string

  @IsBoolean()
  @IsOptional()
  isRemote?: boolean

  @IsBoolean()
  @IsOptional()
  hasPot?: boolean
}

export class OrganizerDTO {
  @IsString()
  @IsMongoId()
  organizer: string
}

export class AttendeeDTO {
  @IsString()
  @IsMongoId()
  attendee: string

  @IsOptional()
  @IsBoolean()
  going?: boolean
}
