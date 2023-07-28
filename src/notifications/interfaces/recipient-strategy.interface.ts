import { Recipient } from './recipient.interface'

export interface RecipientStrategy {
  getRecipients(entityId: string): Promise<Recipient[]>
}
