import { Schema, Document } from 'mongoose'

export const OrganizerSchema = new Schema({
  id: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true }
})

export interface OrganizerDocument extends Document {
  id: string
  name: string
}
