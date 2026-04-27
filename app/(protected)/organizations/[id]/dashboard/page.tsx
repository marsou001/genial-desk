import { redirect } from "next/navigation";
import { fetchStats } from "@/data/fetchStats";
import DashboardClient from "@/components/interfaces/organizations/dashboard/DashboardClient";
import { PERIOD_VALUES } from "@/components/common/DropdownPeriodSelection";

export default async function Dashboard({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ period?: string }>;
}) {
  const { id: organizationId } = await params;
  const { period } = await searchParams;

  const days = period ? Number(period) : 30;

  if (!period || !PERIOD_VALUES.includes(days)) {
    redirect(`/organizations/${organizationId}/dashboard?period=30`);
  }

  const stats = await fetchStats(organizationId, days);

  return (
    <DashboardClient initialStats={stats} organizationId={organizationId} />
  );
}
