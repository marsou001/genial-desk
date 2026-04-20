import { EVENT_TYPES } from "./NotificationsBell.constants";
import { InviteRejectedPayload, MemberAddedPayload, MemberRemovedPayload, NotificationEventPayload, NotificationEventType, NotificationItemState } from "./NotificationsBell.types";

function isNotificationEventType(v: string): v is NotificationEventType {
  return (EVENT_TYPES as string[]).includes(v);
}

function asRecord(v: unknown): Record<string, unknown> | null {
  return v !== null && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : null;
}

function firstOrNull<T>(v: T | T[] | null | undefined): T | null {
  if (v === null || v === undefined) return null;
  return Array.isArray(v) ? (v[0] ?? null) : v;
}

export function mapSupabaseNotificationRow(
  row: unknown,
): NotificationItemState | null {
  const r = asRecord(row);
  if (!r) return null;

  const id = typeof r.id === "string" ? r.id : null;
  const event = typeof r.event === "string" ? r.event : null;
  if (!id || !event) return null;

  const isRead = Boolean(r.is_read);
  const readAt = typeof r.read_at === "string" ? r.read_at : null;
  const createdAt = typeof r.created_at === "string" ? r.created_at : null;
  if (!createdAt) return null;

  const ne = firstOrNull(asRecord(r.notification_events));
  if (!ne) return null;

  const typeRaw = ne.type;
  if (typeof typeRaw !== "string" || !isNotificationEventType(typeRaw)) {
    return null;
  }

  const payloadRaw = ne.payload;
  const payload: NotificationEventPayload | null =
    payloadRaw !== null &&
    typeof payloadRaw === "object" &&
    !Array.isArray(payloadRaw)
      ? ({ ...payloadRaw, type: typeRaw } as NotificationEventPayload)
      : null;

  if (!payload) return null

  return {
    id,
    event,
    isRead,
    readAt,
    createdAt,
    payload,
  };
}

function newMemberDisplayName(payload: MemberAddedPayload): string {
  const name = payload.new_member_name;
  const email = payload.new_member_email;
  if (typeof name === "string" && name.trim().length > 0) return name.trim();
   return email.trim();
}

function invitedUserDisplayName(payload: InviteRejectedPayload): string {
  const name = payload.invited_user_name;
  const email = payload.invited_user_email;
  if (typeof name === "string" && name.trim().length > 0) return name.trim();
  return email.trim();
}

function removedMemberDisplayName(payload: MemberRemovedPayload): string {
  const name = payload.removed_member_name;
  const email = payload.removed_member_email;
  if (typeof name === "string" && name.trim().length > 0) return name.trim();
   return email.trim();
}

export function getNotificationMessage(
  payload: NotificationEventPayload,
  targetUserId: string,
): string {
  const orgName = payload.organization_name;

  switch (payload.type) {
    case "new_invite":
      return `You have an invitation to join ${orgName}`;
    case "invite_rejected":
      const who = invitedUserDisplayName(payload);
      return `${who} has rejected your invitation`;
    case "member_added": {
      const newMemberId = payload.new_member_id as string | undefined;
      const invitedById = payload.invited_by_id as string | undefined;
      const who = newMemberDisplayName(payload);

      if (newMemberId && targetUserId === newMemberId) {
        return `You are now a member of ${orgName}`;
      }
      if (invitedById && targetUserId === invitedById) {
        return `${who} has accepted your invitation`;
      }
      return `${who} is now a member of ${orgName}`;
    }
    case "invite_rejected":
      return `An invitation was declined for ${orgName}`;
    case "member_removed": {
      const removedMemberId = payload.removed_member_id;
      const who = removedMemberDisplayName(payload);
      return targetUserId === removedMemberId
        ? `You are no longer a member of ${orgName}`
        : `${who} is no longer a member of ${orgName}`;
    }
    case "organization_deleted":
      return `${orgName} does not exist anymore`;
    default:
      return "You have a new notification";
  }
}