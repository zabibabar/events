import { PartialType, PickType } from '@nestjs/mapped-types'
import { PostCreateDTO } from './post-create.dto'

export class PostUpdateDTO extends PartialType(PickType(PostCreateDTO, ['body'])) {}
