import { Schema, Document } from 'mongoose'

export const OrganizerSchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId, required: true, unique: true },
    name: { type: String, required: true }
  },
  { timestamps: { createdAt: true }, _id: false }
)

export interface OrganizerDocument extends Document {
  id: string
  name: string
}
