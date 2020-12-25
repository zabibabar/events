import { Schema, Document } from 'mongoose';

const MemberSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    muted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const GroupSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    members: [MemberSchema],
  },
  { timestamps: true },
);

export interface Member {
  id: string;
  name: string;
  muted: boolean;
}

export interface Group extends Document {
  id: string;
  name: string;
  description: string;
  members: [Member];
}
