import { Schema, Document } from 'mongoose'

const MemberSchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    muted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

export const GroupSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    members: [MemberSchema]
  },
  { timestamps: true }
)

export interface Member {
  id: string
  name: string
  muted: boolean
}

export interface Group extends Document {
  id: string
  name: string
  description: string
  members: [Member]
}
