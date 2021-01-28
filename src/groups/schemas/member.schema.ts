import { Schema, Document } from 'mongoose'

export const MemberSchema = new Schema(
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

export interface MemberDocument extends Document {
  id: string
  name: string
  muted: boolean
}
