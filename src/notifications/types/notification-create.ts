import { Notification } from '../interfaces/notification.interface'

export type NotificationCreate = Omit<Notification, 'id'>
