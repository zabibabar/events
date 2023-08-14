import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class TaskCreateDTO {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description?: string
}
