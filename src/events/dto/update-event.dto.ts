import { PartialType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create-event.dto'

export class UpdateUserDto extends PartialType(CreateUserDto) {}
