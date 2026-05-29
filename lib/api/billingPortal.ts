import { post } from "./client";

export interface CreatePortalSessionResponse {
  url: string;
}

export async function createPortalSession(
  customerId: string,
  organizationId: string,
): Promise<CreatePortalSessionResponse> {
  return post<CreatePortalSessionResponse>("billing/portal", {
    customerId,
    organizationId,
  });
}
