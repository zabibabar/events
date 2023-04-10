import { Type } from 'class-transformer'
import { IsMongoId } from 'class-validator'

export class EventCountQueryParamDTO {
  @IsMongoId()
  groupId: string

  @Type(() => Date)
  currentDate: Date
}
