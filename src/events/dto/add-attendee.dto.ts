import { Type } from 'class-transformer'
import { IsMongoId, IsOptional, IsString } from 'class-validator'

export class AddAttendeeDTO {
  @IsString()
  @IsMongoId()
  userId: string

  @IsOptional()
  @Type(() => Date)
  currentDate: Date
}
