import { Schema, Document } from 'mongoose'
import { USER_COLLECTION_NAME } from 'src/users/schemas/user.schema'

export const AttendeeSchema = new Schema(
  {
    attendee: {
      type: Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME,
      required: true,
      unique: true
    },
    going: {
      type: Boolean,
      default: false
    },
    isOrganizer: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: { createdAt: true }, _id: false }
)

export interface AttendeeDocument extends Document {
  attendee: string
  going: boolean
  isOrganizer: boolean
  lastUpdated: Date
}
