import { Types } from 'mongoose'
import { Like } from './post-likes.interface'

export interface PostComment {
  userId: Types.ObjectId
  body: string
  likes: Like[]
}
