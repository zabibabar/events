import { IsNotEmpty, IsString } from 'class-validator'

export class PostCommentCreateDTO {
  @IsString()
  @IsNotEmpty()
  body: string
}
