import { Schema, HydratedDocument } from 'mongoose'

import { MemberSchema } from './member.schema'
import { Group } from '../interfaces/group.interface'
import { GroupVirtuals } from '../interfaces/group-virtuals.interface'

export type GroupDocument = HydratedDocument<Group, GroupVirtuals>

export const GROUP_COLLECTION_NAME = 'Group'

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

GroupSchema.virtual('membersCount').get(function (this: GroupDocument) {
  return this.members?.length
})

GroupSchema.virtual('organizersCount').get(function (this: GroupDocument) {
  return this.members?.filter(({ isOrganizer }) => isOrganizer).length
})
