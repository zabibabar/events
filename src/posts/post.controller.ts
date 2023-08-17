import { Body, Controller, Delete, Get, Param, Patch, Post as PostReq, Query } from '@nestjs/common'
import { PostService } from './post.service'
import { PostParams } from './dto/post-params.dto'
import { Post } from './interfaces/post.interface'
import { UserExternalId } from 'src/users/decorators/user-external-id.decorator'
import { UserIdByExternalIdPipe } from 'src/users/pipes/user-id-by-external-id.pipe'
import { PostUpdateDTO } from './dto/post-update.dto'
import { PostCreateDTO } from './dto/post-create.dto'
import { PostComment } from './interfaces/post-comment.interface'

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  getAllPosts(@Query() { sourceId }: { sourceId: string }): Promise<Post[]> {
    return this.postService.getAllPosts(sourceId)
  }

  @PostReq()
  createPost(@Body() body: PostCreateDTO): Promise<Post> {
    return this.postService.createPost(body)
  }

  @Patch(':postId')
  updatePost(@Param() { postId }: PostParams, @Body() body: PostUpdateDTO): Promise<Post> {
    return this.postService.updatePost(postId, body)
  }

  @Delete(':postId')
  deletePost(@Param() { postId }: PostParams): Promise<void> {
    return this.postService.deletePost(postId)
  }

  @PostReq(':postId/like')
  likePost(
    @Param() { postId }: PostParams,
    @UserExternalId(UserIdByExternalIdPipe) userId: string
  ): Promise<Post> {
    return this.postService.likePost(postId, userId)
  }

  @Delete(':postId/like')
  unlikePost(
    @Param() { postId }: PostParams,
    @UserExternalId(UserIdByExternalIdPipe) userId: string
  ): Promise<Post> {
    return this.postService.unlikePost(postId, userId)
  }

  @PostReq(':postId/posts')
  addCommentToPost(
    @Param() { postId }: PostParams,
    @Body() body: PostCreateDTO
  ): Promise<PostComment[]> {
    return this.postService.addCommentToPost(postId, body)
  }

  @Patch(':postId/comments/:commentId')
  updateComment(
    @Param() { postId, commentId }: PostParams,
    @Body() body: PostUpdateDTO
  ): Promise<PostComment[]> {
    return this.postService.updateComment(postId, commentId, body)
  }

  @Delete(':postId/comments/:commentId')
  deleteComment(@Param() { postId, commentId }: PostParams): Promise<PostComment[]> {
    return this.postService.deleteComment(postId, commentId)
  }

  @PostReq(':postId/comments/:commentId/like')
  likeComment(
    @Param() { postId, commentId }: PostParams,
    @UserExternalId(UserIdByExternalIdPipe) userId: string
  ): Promise<PostComment[]> {
    return this.postService.likeComment(postId, commentId, userId)
  }

  @Delete(':postId/comments/:commentId/like')
  unlikeComment(
    @Param() { postId, commentId }: PostParams,
    @UserExternalId(UserIdByExternalIdPipe) userId: string
  ): Promise<PostComment[]> {
    return this.postService.unlikeComment(postId, commentId, userId)
  }
}
