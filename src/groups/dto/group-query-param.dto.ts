import { Type } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'

export class GroupQueryParamDTO {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  skip = 0

  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(10)
  limit = 0
}
