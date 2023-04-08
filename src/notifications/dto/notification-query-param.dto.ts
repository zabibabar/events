import { Type } from 'class-transformer'
import { IsBoolean, IsInt, IsMongoId, IsOptional, Max, Min } from 'class-validator'

export class NotificationQueryParamDTO {
  @IsOptional()
  @IsMongoId()
  groupId?: string

  @IsOptional()
  @IsMongoId()
  eventId?: string

  @IsOptional()
  @IsBoolean()
  isRead?: boolean

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  skip = 0

  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(10)
  limit = 20

  @IsOptional()
  @Type(() => Date)
  currentDate: Date
}
