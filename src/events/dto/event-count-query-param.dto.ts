import { Type } from 'class-transformer'
import { IsDate, IsMongoId } from 'class-validator'

export class EventCountQueryParamDTO {
  @IsMongoId()
  groupId: string

  @IsDate()
  @Type(() => Date)
  currentDate: Date
}
