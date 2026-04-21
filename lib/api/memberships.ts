import { del } from "./client";

export async function leaveOrganization(
  membershipId: string,
  role: string,
): Promise<void> {
  await del(`/api/memberships/${membershipId}`, {}, {
    "x-membership-role": role,
  });
}