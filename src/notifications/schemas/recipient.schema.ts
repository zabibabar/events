import { Schema, HydratedDocument } from 'mongoose'
import { USER_COLLECTION_NAME } from 'src/users/schemas/user.schema'
import { Recipient } from '../interfaces/recipient.interface'

export type RecipientDocument = HydratedDocument<Recipient>

export const RecipientSchema = new Schema<Recipient>(
  {
    id: { type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME, required: true },
    isRead: { type: Boolean, default: false }
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

RecipientSchema.virtual('user', {
  ref: USER_COLLECTION_NAME,
  localField: 'id',
  foreignField: '_id',
  justOne: true
})
