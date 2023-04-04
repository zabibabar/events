import { Type } from 'class-transformer'
import { IsInt, IsMongoId, IsOptional, Max, Min } from 'class-validator'

export class EventQueryParamDTO {
  @IsOptional()
  @IsMongoId()
  groupId: string

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

  @IsOptional()
  @Type(() => Date)
  currentDate: Date
}
