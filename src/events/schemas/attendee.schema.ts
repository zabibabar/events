import { Schema, Document } from 'mongoose'

export const AttendeeSchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    going: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

export interface AttendeeDocument extends Document {
  id: string
  name: string
  going: boolean
  lastUpdated: Date
}
