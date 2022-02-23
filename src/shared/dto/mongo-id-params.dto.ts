import { IsMongoId, IsString } from 'class-validator'

export class MongoIdParams {
  @IsString()
  @IsMongoId()
  id: string
}
