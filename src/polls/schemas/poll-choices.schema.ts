import { Schema } from 'mongoose'
import { USER_COLLECTION_NAME } from 'src/users/schemas/user.schema'

export const PollChoiceSchema = new Schema(
  {
    body: { type: String, required: true },
    votes: {
      type: [{ type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME }],
      default: []
    }
  },
  {
    timestamps: false,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret.__v
        delete ret._id
        return ret
      }
    }
  }
)
