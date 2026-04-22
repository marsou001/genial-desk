export type NotificationEventType =
  | "new_invite"
  | "invite_rejected"
  | "invite_accepted"
  | "member_removed"
  | "organization_deleted"
  | "feedback_uploaded";

export type NewInvitePayload = {
  type: "new_invite";
  invited_user_id: string;
  organization_name: string;
};

export type InviteRejectedPayload = {
  type: "invite_rejected";
  sender_user_id: string;
  invited_user_name: string | null;
  invited_user_email: string;
  organization_name: string;
};

export type InviteAcceptedPayload = {
  type: "invite_accepted";
  new_member_id: string;
  invited_by_id: string;
  new_member_name: string | null;
  new_member_email: string;
  organization_name: string;
};

export type MemberRemovedPayload = {
  type: "member_removed";
  removed_member_id: string;
  removed_member_name: string | null;
  removed_member_email: string;
  organization_name: string;
};

export type OrganizationDeletedPayload = {
  type: "organization_deleted";
  organization_name: string;
};

export type FeedbackUploadedPayload = {
  type: "feedback_uploaded";
  organization_name: string;
  uploader_name: string | null;
  uploader_email: string;
};

export type NotificationEventPayload =
  | NewInvitePayload
  | InviteRejectedPayload
  | InviteAcceptedPayload
  | MemberRemovedPayload
  | OrganizationDeletedPayload
  | FeedbackUploadedPayload;

/** Flat shape for UI + Realtime merge */
export type NotificationItemState = {
  id: string;
  event: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  payload: NotificationEventPayload;
};
