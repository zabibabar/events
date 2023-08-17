import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { POST_COLLECTION_NAME, PostSchema } from './schemas/post.schema'
import { PostController } from './post.controller'
import { PostService } from './post.service'
import { UsersModule } from 'src/users/user.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: POST_COLLECTION_NAME, schema: PostSchema }]),
    UsersModule
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [MongooseModule, PostService]
})
export class PostsModule {}
