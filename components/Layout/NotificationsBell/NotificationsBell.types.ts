export type NotificationEventType =
  | "new_invite"
  | "invite_rejected"
  | "member_added"
  | "member_removed";

export type NewInvitePayload = {
  type: "new_invite";
  invited_user_id: string;
};

export type InviteRejectedPayload = {
  type: "invite_rejected";
  sender_user_id: string;
  invited_user_name: string | null;
  invited_user_email: string;
}

export type MemberAddedPayload = {
  type: "member_added";
  new_member_id: string;
  invited_by_id: string;
  new_member_name: string | null;
  new_member_email: string;
};

export type NotificationEventPayload = NewInvitePayload | InviteRejectedPayload | MemberAddedPayload;

/** Flat shape for UI + Realtime merge */
export type NotificationItemState = {
  id: string;
  event: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  payload: NotificationEventPayload;
  orgName: string | null;
  senderName: string | null;
  senderEmail: string | null;
};