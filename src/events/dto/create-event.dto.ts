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
import { Event } from '../interfaces/event.interface'

export class CreateEventDTO implements Omit<Event, 'id'> {
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

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AttendeeDTO)
  attendees: AttendeeDTO[] = []

  @IsString()
  @IsNotEmpty()
  address: string
}

export class AttendeeDTO {
  @IsString()
  @IsMongoId()
  id: string

  @IsBoolean()
  going: boolean

  @IsBoolean()
  isOrganizer: boolean
}
