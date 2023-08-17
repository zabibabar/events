import { PartialType } from '@nestjs/mapped-types'
import { PostCommentCreateDTO } from './post-comment-create.dto'

export class PostCommentUpdateDTO extends PartialType(PostCommentCreateDTO) {}
