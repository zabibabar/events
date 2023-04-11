import { Type } from 'class-transformer'
import { IsDate } from 'class-validator'

export class GroupDeleteDTO {
  @IsDate()
  @Type(() => Date)
  currentDate: Date
}
