import { Schema, Document } from 'mongoose'

import { MemberSchema } from './member.schema'
import { Member } from '../interfaces/member.interface'

export const GroupSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    members: [MemberSchema]
  },
  { timestamps: true }
)

export interface GroupDocument extends Document {
  id: string
  name: string
  description: string
  members: [Member]
}
