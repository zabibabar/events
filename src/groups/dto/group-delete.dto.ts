import { Type } from 'class-transformer'

export class GroupDeleteDTO {
  @Type(() => Date)
  currentDate: Date
}
