import { NotificationEventType } from "./NotificationsBell.types";

export const EVENT_TYPES: NotificationEventType[] = [
  "new_invite",
  "invite_rejected",
  "member_added",
  "member_removed",
];

export const NOTIFICATION_LIST_SELECT = `
  id,
  event,
  is_read,
  read_at,
  created_at,
  notification_events (
    type,
    payload,
    organizations ( name ),
    profiles ( full_name, email )
  )
`;