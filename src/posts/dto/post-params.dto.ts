import { IsMongoId, IsOptional } from 'class-validator'

export class PostParams {
  @IsMongoId()
  @IsOptional()
  postId: string

  @IsMongoId()
  @IsOptional()
  commentId: string
}
