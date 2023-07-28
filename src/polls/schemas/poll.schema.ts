import { Schema } from 'mongoose'
import { EVENT_COLLECTION_NAME } from 'src/events/schemas/event.schema'
import { GROUP_COLLECTION_NAME } from 'src/groups/schemas/group.schema'
import { USER_COLLECTION_NAME } from 'src/users/schemas/user.schema'
import { PollChoiceSchema } from './poll-choices.schema'

export const PollSchema = new Schema(
  {
    createdById: { type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME, required: true },
    entityId: { type: Schema.Types.ObjectId, required: true, refPath: 'entityModel' },
    entityModel: {
      type: String,
      required: true,
      enum: [EVENT_COLLECTION_NAME, GROUP_COLLECTION_NAME]
    },
    body: { type: String, required: true },
    choices: { type: [PollChoiceSchema], required: true },
    expiresAt: Date,
    isExpired: { type: Boolean, default: false },
    isAnonymous: { type: Boolean, default: false },
    allowMultiple: { type: Boolean, default: false }
  },
  {
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

PollSchema.virtual('createdBy', {
  ref: USER_COLLECTION_NAME,
  localField: 'createdById',
  foreignField: '_id',
  justOne: true
})
