import { Type } from 'class-transformer'
import { IsBoolean, IsDate, IsInt, IsOptional, Max, Min } from 'class-validator'

export class EventQueryParamDTO {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  skip? = 0

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(10)
  pastLimit?: number

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(10)
  upcomingLimit?: number

  @IsDate()
  @Type(() => Date)
  currentDate: Date

  @IsOptional()
  @IsBoolean()
  isGoing = false
}
