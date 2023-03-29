import { Types } from 'mongoose'

export interface User {
  id: Types.ObjectId
  externalId: string
  name: string
  firstName: string
  lastName: string
  email: string
  picture: string
  emailVerified: boolean
  locale: string
}
