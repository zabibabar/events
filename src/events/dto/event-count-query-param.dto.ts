import { Type } from 'class-transformer'
import { IsDate } from 'class-validator'

export class EventCountQueryParamDTO {
  @IsDate()
  @Type(() => Date)
  currentDate: Date
}
