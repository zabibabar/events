import { Types } from 'mongoose'
import { PostComment } from './post-comment.interface'
import { EVENT_COLLECTION_NAME } from 'src/events/schemas/event.schema'
import { GROUP_COLLECTION_NAME } from 'src/groups/schemas/group.schema'
import { Like } from './post-likes.interface'

export interface Post {
  id: Types.ObjectId
  createdById: Types.ObjectId
  sourceId: Types.ObjectId
  sourceModel: typeof EVENT_COLLECTION_NAME | typeof GROUP_COLLECTION_NAME
  body: string
  comments: PostComment[]
  likes: Like[]
}
