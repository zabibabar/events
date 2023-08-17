import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { POST_COLLECTION_NAME, PostDocument } from './schemas/post.schema'
import { Post } from './interfaces/post.interface'
import { PostCreateDTO } from './dto/post-create.dto'
import { PostUpdateDTO } from './dto/post-update.dto'
import { PostComment } from './interfaces/post-comment.interface'
import { PostCommentUpdateDTO } from './dto/post-comment-update.dto'
import { PostCommentCreateDTO } from './dto/post-comment-create.dto'

@Injectable()
export class PostService {
  constructor(@InjectModel(POST_COLLECTION_NAME) private PostModel: Model<PostDocument>) {}

  async getAllPosts(eventId: string): Promise<Post[]> {
    const postLists = await this.PostModel.find({ eventId })
      .populate({
        path: 'posts.likes.user',
        select: 'name picture'
      })
      .exec()
    return postLists.map((postDoc) => this.convertPostDocumentToPost(postDoc))
  }

  async createPost(body: PostCreateDTO): Promise<Post> {
    const newPost = new this.PostModel({
      ...body,
      posts: [],
      comments: []
    })

    return this.convertPostDocumentToPost(await newPost.save())
  }

  async updatePost(postId: string, postListFields: PostUpdateDTO): Promise<Post> {
    const postDoc = await this.PostModel.findByIdAndUpdate(
      postId,
      { $set: postListFields },
      { new: true }
    )
      .populate({
        path: 'posts.likes.user',
        select: 'name picture'
      })
      .exec()

    return this.convertPostDocumentToPost(postDoc)
  }

  async deletePost(postId: string): Promise<void> {
    const result = await this.PostModel.deleteOne({ _id: postId }).exec()
    if (result.deletedCount === 0) throw new NotFoundException('Post List not found')
  }

  async likePost(postId: string, userId: string): Promise<Post> {
    const postDoc = await this.PostModel.findOneAndUpdate(
      { _id: postId, 'likes.userId': { $ne: userId } },
      { $push: { 'posts.$.likes': { userId } } },
      { new: true }
    )
      .populate({
        path: 'posts.likes.user',
        select: 'name picture'
      })
      .exec()

    return this.convertPostDocumentToPost(postDoc)
  }

  async unlikePost(postId: string, userId: string): Promise<Post> {
    const postDoc = await this.PostModel.findOneAndUpdate(
      { _id: postId, 'likes.userId': { $ne: userId } },
      { $pull: { 'posts.$.likes': { userId } } },
      { new: true }
    )
      .populate({
        path: 'posts.likes.user',
        select: 'name picture'
      })
      .exec()

    return this.convertPostDocumentToPost(postDoc)
  }

  async addCommentToPost(postId: string, post: PostCommentCreateDTO): Promise<PostComment[]> {
    const postDoc = await this.PostModel.findByIdAndUpdate(
      postId,
      { $push: { posts: { ...post, likes: [] } } },
      { new: true }
    )
      .populate({
        path: 'posts.likes.user',
        select: 'name picture'
      })
      .exec()

    return this.convertPostDocumentToPost(postDoc).comments
  }

  async updateComment(
    postId: string,
    commentId: string,
    comment: PostCommentUpdateDTO
  ): Promise<PostComment[]> {
    const postDoc = await this.PostModel.findOneAndUpdate(
      { _id: postId, 'comments._id': commentId },
      { $set: { 'comments.$.body': comment.body } },
      { new: true }
    )
      .populate({
        path: 'posts.likes.user',
        select: 'name picture'
      })
      .exec()

    return this.convertPostDocumentToPost(postDoc).comments
  }

  async deleteComment(postId: string, commentId: string): Promise<PostComment[]> {
    const postDoc = await this.PostModel.findOneAndUpdate(
      { _id: postId },
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    )
      .populate({
        path: 'posts.likes.user',
        select: 'name picture'
      })
      .exec()

    return this.convertPostDocumentToPost(postDoc).comments
  }

  async likeComment(postId: string, commentId: string, userId: string): Promise<PostComment[]> {
    const postDoc = await this.PostModel.findOneAndUpdate(
      { _id: postId, 'posts._id': commentId },
      { $push: { 'comments.$.likes': { userId } } },
      { new: true }
    )
      .populate({
        path: 'posts.likes.user',
        select: 'name picture'
      })
      .exec()

    return this.convertPostDocumentToPost(postDoc).comments
  }

  async unlikeComment(postId: string, commentId: string, userId: string): Promise<PostComment[]> {
    const postDoc = await this.PostModel.findOneAndUpdate(
      { _id: postId, 'posts._id': commentId },
      { $pull: { 'posts.$.likes': { userId } } },
      { new: true }
    )
      .populate({
        path: 'posts.likes.user',
        select: 'name picture'
      })
      .exec()

    return this.convertPostDocumentToPost(postDoc).comments
  }

  private convertPostDocumentToPost(postDoc: PostDocument | null): Post {
    if (!postDoc) throw new NotFoundException('Post not found')
    return postDoc.toJSON()
  }
}
