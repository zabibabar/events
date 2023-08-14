import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class TaskListCreateDTO {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description?: string
}
