"use client";

import { useState, useRef, useTransition } from "react";
import { toast } from "sonner";
import { Stats } from "@/types";
import { getStats } from "@/lib/api/stats";
import SummaryCards from "./SummaryCards";
import ChartsGrid from "./ChartsGrid";
import SentimentsDistribution from "./SentimentsDistribution";
import NoFeedbackFound from "./NoFeedbackFound";
import DropdownPeriodSelection from "@/components/common/DropdownPeriodSelection";
import DownloadPDFReport from "./DownloadPDFReport";

export default function DashboardClient({
  initialStats,
  organizationId,
}: {
  initialStats: Stats | null;
  organizationId: string;
}) {
  const [stats, setStats] = useState<Stats | null>(initialStats);
  const [isFetching, setIsFetching] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState(30);
  const [_, startTransition] = useTransition();
  const contentRef = useRef<HTMLDivElement>(null);

  async function fetchStats(period: number) {
    setIsFetching(true);
    setCurrentPeriod(period);

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
      <div className="flex items-center justify-end gap-3">
        <DropdownPeriodSelection fetchData={fetchStats} disabled={isFetching} />
        {stats && stats.total > 0 && (
          <DownloadPDFReport
            stats={stats}
            organizationId={organizationId}
            period={currentPeriod}
            contentRef={contentRef}
          />
        )}
      </div>
      {!stats || stats.total === 0 ? (
        <NoFeedbackFound organizationId={organizationId} />
      ) : (
        <div ref={contentRef}>
          <SummaryCards stats={stats} />
          <ChartsGrid stats={stats} />
          <SentimentsDistribution stats={stats} />
        </div>
      )}
    </div>
  );
}
