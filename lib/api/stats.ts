import { get } from "./client";
import { Stats } from "@/types";

export async function getStats(
  organizationId: string,
  days: number = 30,
): Promise<Stats> {
  return get<Stats>(
    `organizations/${organizationId}/stats?days=${days}`,
  );
}