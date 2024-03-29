export enum NotificationType {
  GROUP_JOINED = 'GROUP_JOINED', // All members
  GROUP_NAME_CHANGED = 'GROUP_NAME_CHANGED', // All members
  GROUP_DELETED = 'GROUP_DELETED', // All members
  EVENT_CREATED = 'EVENT_CREATED', // All members
  EVENT_TIME_LOCATION_CHANGED = 'EVENT_TIME_LOCATION_CHANGED', // All attendees
  EVENT_ATTENDEES_CHANGED = 'EVENT_ATTENDEES_CHANGED', // Only organizers
  EVENT_UPCOMING = 'EVENT_UPCOMING', // All attendees
  EVENT_CANCELLED = 'EVENT_CANCELLED' // All attendees
}
