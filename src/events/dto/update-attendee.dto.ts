import { Type } from 'class-transformer'
import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator'

export class UpdateAttendeeDTO {
  @IsOptional()
  @IsBoolean()
  isGoing: boolean

  @IsOptional()
  @IsNumber()
  @Max(5)
  @Min(0)
  @Type(() => Number)
  guests: number

  @IsOptional()
  @Type(() => Date)
  currentDate: Date
}
