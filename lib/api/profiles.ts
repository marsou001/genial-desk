import { patch } from "./client";

export async function updateProfile(
  profileId: string,
  fullName: string,
): Promise<void> {
  await patch(`profiles/${profileId}`, { full_name: fullName });
}