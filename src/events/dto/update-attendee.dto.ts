import { Type } from 'class-transformer'
import { IsBoolean, IsOptional } from 'class-validator'

export class UpdateAttendeeDTO {
  @IsBoolean()
  isGoing: boolean

  @IsOptional()
  @Type(() => Date)
  currentDate: Date
}
