import { IsMongoId, IsOptional } from 'class-validator'

export class MongoIdParams {
  @IsMongoId()
  eventId: string

  @IsMongoId()
  @IsOptional()
  taskListId: string

  @IsMongoId()
  @IsOptional()
  taskId: string
}
