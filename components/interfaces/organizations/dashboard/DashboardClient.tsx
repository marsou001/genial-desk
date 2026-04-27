"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Stats } from "@/types";
import { getStats } from "@/lib/api/stats";
import SummaryCards from "./SummaryCards";
import ChartsGrid from "./ChartsGrid";
import SentimentsDistribution from "./SentimentsDistribution";
import NoFeedbackFound from "./NoFeedbackFound";
import DropdownPeriodSelection from "@/components/common/DropdownPeriodSelection";

export default function DashboardClient({
  initialStats,
  organizationId,
}: {
  initialStats: Stats | null;
  organizationId: string;
}) {
  const [stats, setStats] = useState<Stats | null>(initialStats);
  const [isFetching, setIsFetching] = useState(false);
  const [_, startTransition] = useTransition();

  async function fetchStats(period: number) {
    setIsFetching(true);

    try {
      const newStats = await getStats(organizationId, period);
      startTransition(() => {
        setStats(newStats);
      });
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch stats",
      );
      return false;
    } finally {
      setIsFetching(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <DropdownPeriodSelection fetchData={fetchStats} disabled={isFetching} />
      </div>
      {!stats || stats.total === 0 ? (
        <NoFeedbackFound organizationId={organizationId} />
      ) : (
        <>
          <SummaryCards stats={stats} />
          <ChartsGrid stats={stats} />
          <SentimentsDistribution stats={stats} />
        </>
      )}
    </div>
  );
}
