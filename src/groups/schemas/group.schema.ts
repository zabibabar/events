import { Schema, Document } from 'mongoose'

import { MemberSchema } from './member.schema'
import { Member } from '../interfaces/member.interface'

export const GroupSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    inviteCode: Schema.Types.ObjectId,
    members: { type: [MemberSchema], default: [] }
  },
  { timestamps: true }
)

export interface GroupDocument extends Document {
  id: string
  name: string
  inviteCode: string
  description?: string
  members: Member[]
}

export const GROUP_COLLECTION_NAME = 'Group'
