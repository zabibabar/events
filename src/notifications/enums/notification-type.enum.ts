export enum NotificationType {
  GROUP_JOINED = 'GROUP_JOINED', // All members, joinerId, groupId
  GROUP_DELETED = 'GROUP_DELETED', // All members, organizerId, groupId
  EVENT_CREATED = 'EVENT_CREATED', // All members, organizerId, eventId
  EVENT_ATTENDEES_UPDATED = 'EVENT_ATTENDEES_UPDATED', // All attendees, attendeeId, eventId
  EVENT_ATTENDEES_REMINDER = 'EVENT_ATTENDEES_REMINDER', // All attendees, eventId
  EVENT_REMINDER = 'EVENT_REMINDER', // All members, eventId
  EVENT_CANCELLED = 'EVENT_CANCELLED' // All attendees, organizerId, eventId
}
