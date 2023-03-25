import { IsBoolean, IsDate, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'
import { Event } from '../interfaces/event.interface'

export class CreateEventDTO implements Omit<Event, 'id' | 'picture' | 'attendees'> {
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
