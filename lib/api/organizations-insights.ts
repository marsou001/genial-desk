import { get } from "./client";
import { Insights } from "@/types";

export async function getInsights(
  organizationId: string,
  days: number = 7,
): Promise<Insights> {
  return get<Insights>(
    `/api/organizations/${organizationId}/insights/weekly?days=${days}`,
  );
}