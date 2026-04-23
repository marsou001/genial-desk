import { patch } from "./client";

export interface InviteResponse {
  organizationId: string;
}

export async function respondToInvite(
  inviteToken: string,
  shouldAccept: boolean,
): Promise<InviteResponse> {
  return patch<InviteResponse>("invites", {
    should_accept: shouldAccept,
    invite_token: inviteToken,
  });
}