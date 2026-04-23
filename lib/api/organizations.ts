import { del, post, postFormData, patch } from "./client";

export interface FeedbackResponse {
  success: boolean;
  error?: string;
}

export interface UploadResponse {
  success: boolean;
  processed: number;
  errors?: string[];
  feedbacks?: unknown[];
}

export interface InviteResponse {
  organizationId: string;
}

export async function deleteOrganization(organizationId: string): Promise<void> {
  await del(`/organizations/${organizationId}`);
}

export async function createFeedback(
  organizationId: string,
  text: string,
  source: string,
): Promise<FeedbackResponse> {
  return post(`/organizations/${organizationId}/feedback`, {
    text,
    source,
  });
}

export async function uploadCSV(
  organizationId: string,
  file: File,
  source: string,
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("source", source);
  return postFormData<UploadResponse>(
    `/organizations/${organizationId}/upload`,
    formData,
  );
}

export async function removeMember(
  organizationId: string,
  memberId: string,
): Promise<void> {
  await del(`/organizations/${organizationId}/members`, { id: memberId });
}

export async function respondToInvite(
  inviteToken: string,
  shouldAccept: boolean,
): Promise<InviteResponse> {
  return patch(`invites`, {
    should_accept: shouldAccept,
    invite_token: inviteToken,
  });
}