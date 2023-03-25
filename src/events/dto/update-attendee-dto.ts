import { IsBoolean } from 'class-validator'

export class UpdateAttendeeDTO {
  @IsBoolean()
  isGoing: boolean
}
