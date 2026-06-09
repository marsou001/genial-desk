import { useState } from "react";
import { get, patch, del } from "./client";

export interface OrganizationData {
  id: string;
  organizationId: string;
  organizationName: string;
  role: string;
  remainingAIRuns: number;
  remainingUploads: number;
  maxAIRuns: number;
  maxUploads: number;
  createdAt: string;
}

export interface InviteResponse {
  organizationId: string;
}

export function useFetchOrganization() {
  const [data, setData] = useState<OrganizationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchOrganization(organizationId: string) {
    setLoading(true);
    setError(null);
    try {
      const response = await get<{ organization: OrganizationData }>(
        `organizations/${organizationId}`,
      );
      setData(response.organization);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch organization",
      );
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetchOrganization };
}

export async function deleteOrganization(
  organizationId: string,
): Promise<void> {
  await del(`/organizations/${organizationId}`);
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
