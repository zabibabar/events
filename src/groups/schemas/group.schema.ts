import { Schema, HydratedDocument } from 'mongoose'

import { MemberSchema } from './member.schema'
import { Group } from '../interfaces/group.interface'

export const GroupSchema = new Schema<Group>(
  {
    name: { type: String, required: true },
    description: String,
    picture: { type: String, default: '' },
    inviteCode: String,
    members: { type: [MemberSchema], default: [] }
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

export type GroupDocument = HydratedDocument<Group>

export const GROUP_COLLECTION_NAME = 'Group'
