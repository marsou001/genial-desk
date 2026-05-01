import { redirect } from "next/navigation";
import { PERIOD_VALUES } from "@/components/common/DropdownPeriodSelection";
import Insights from "@/components/interfaces/organizations/Insights/Insights";
import { fetchInsights } from "@/data/fetchInsights";

export default async function InsightsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ period?: string }>;
}) {
  const { id: organizationId } = await params;
  const { period } = await searchParams;

  const days = period ? Number(period) : 7;

  if (!period || !PERIOD_VALUES.includes(days)) {
    redirect(`/organizations/${organizationId}/insights?period=30`);
  }

  let insights = await fetchInsights(organizationId, days);
  return <Insights insightsData={insights} organizationId={organizationId} />;
}
