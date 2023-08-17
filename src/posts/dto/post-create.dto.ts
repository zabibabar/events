import { IsIn, IsMongoId, IsNotEmpty, IsString } from 'class-validator'
import { EVENT_COLLECTION_NAME } from 'src/events/schemas/event.schema'
import { GROUP_COLLECTION_NAME } from 'src/groups/schemas/group.schema'

export class PostCreateDTO {
  @IsMongoId()
  sourceId: string

  @IsIn([EVENT_COLLECTION_NAME, GROUP_COLLECTION_NAME])
  sourceModel: typeof EVENT_COLLECTION_NAME | typeof GROUP_COLLECTION_NAME

  @IsString()
  @IsNotEmpty()
  body: string
}
