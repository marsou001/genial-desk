import { NotificationEventType } from "./NotificationsBell.types";

export const EVENT_TYPES: NotificationEventType[] = [
  "new_invite",
  "invite_rejected",
  "invite_accepted",
  "member_removed",
  "organization_deleted",
  "feedback_uploaded",
];

export const NOTIFICATION_LIST_SELECT = `
  id,
  event,
  is_read,
  read_at,
  created_at,
  notification_events (
    type,
    payload
  )
`;