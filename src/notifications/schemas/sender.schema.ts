import { Schema, HydratedDocument } from 'mongoose'
import { USER_COLLECTION_NAME } from 'src/users/schemas/user.schema'
import { Sender } from '../interfaces/sender.interface'

export type SenderDocument = HydratedDocument<Sender>

export const SenderSchema = new Schema<Sender>(
  {
    id: { type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME, required: true }
  },
  {
    timestamps: true,
    _id: false,
    toJSON: { virtuals: true },
    toObject: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret.__v
        delete ret._id
        return ret
      }
    }
  }
)

SenderSchema.virtual('user', {
  ref: USER_COLLECTION_NAME,
  localField: 'id',
  foreignField: '_id',
  justOne: true
})
