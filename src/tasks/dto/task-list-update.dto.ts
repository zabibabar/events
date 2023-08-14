import { PartialType } from '@nestjs/mapped-types'
import { TaskListCreateDTO } from './task-list-create.dto'

export class TaskListUpdateDTO extends PartialType(TaskListCreateDTO) {}
