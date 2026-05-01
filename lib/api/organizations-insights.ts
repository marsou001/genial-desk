import { get, post } from "./client";
import { Insights } from "@/types";

export async function getInsights(
  organizationId: string,
  days: number = 30,
): Promise<Insights> {
  return get<Insights>(
    `organizations/${organizationId}/insights?days=${days}`,
  );
}

export async function generateInsights(
  organizationId: string,
  days: number = 30,
): Promise<Insights> {
  return post<Insights>(
    `organizations/${organizationId}/insights?days=${days}`,
  );
}