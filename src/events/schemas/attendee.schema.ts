import { Schema, HydratedDocument } from 'mongoose'
import { USER_COLLECTION_NAME } from 'src/users/schemas/user.schema'
import { Attendee } from '../interfaces/attendee.interface'

export const AttendeeSchema = new Schema<Attendee>(
  {
    id: {
      type: Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME,
      required: true
    },
    isGoing: Boolean,
    isOrganizer: { type: Boolean, default: false }
  },
  { timestamps: true, _id: false, toJSON: { virtuals: true } }
)

AttendeeSchema.virtual('user', {
  ref: USER_COLLECTION_NAME,
  localField: 'id',
  foreignField: '_id',
  justOne: true
})

export type AttendeeDocument = HydratedDocument<Attendee>
