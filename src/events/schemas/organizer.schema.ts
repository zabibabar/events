import { Schema, Document } from 'mongoose'
import { USER_COLLECTION_NAME } from 'src/users/schemas/user.schema'

export const OrganizerSchema = new Schema(
  {
    organizer: {
      type: Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME,
      required: true,
      unique: true
    }
  },
  { timestamps: { createdAt: true }, _id: false }
)

export interface OrganizerDocument extends Document {
  organizer: string
}
