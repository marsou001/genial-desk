import { get } from "./client";
import { Feedback } from "@/types/database";

export async function getFeedbacks(
  organizationId: string,
  days: number = 30,
): Promise<Feedback[]> {
  const response = await get<{ data: Feedback[] }>(
    `organizations/${organizationId}/feedback?days=${days}`
  );
  return response.data;
}