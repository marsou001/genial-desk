"use client";

import { useState, useTransition } from "react";
import { parseAsNumberLiteral, useQueryState } from "nuqs";
import { Stats } from "@/types";
import { getStats } from "@/lib/api/stats";
import SummaryCards from "./SummaryCards";
import ChartsGrid from "./ChartsGrid";
import SentimentsDistribution from "./SentimentsDistribution";
import NoFeedbackFound from "./NoFeedbackFound";
import { PERIOD_OPTIONS, PERIOD_VALUES } from "./DashboardClient.constants";

export default function DashboardClient({
  initialStats,
  organizationId,
}: {
  initialStats: Stats | null;
  organizationId: string;
}) {
  const [period, setPeriod] = useQueryState(
    "period",
    parseAsNumberLiteral(PERIOD_VALUES).withDefault(30),
  );
  const [stats, setStats] = useState<Stats | null>(initialStats);
  const [isPending, startTransition] = useTransition();

  const handlePeriodChange = (newPeriod: number) => {
    setPeriod(newPeriod);
    startTransition(async () => {
      const newStats = await getStats(organizationId, newPeriod);
      setStats(newStats);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <select
          value={period}
          onChange={(e) => handlePeriodChange(Number(e.target.value))}
          disabled={isPending}
          className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {PERIOD_OPTIONS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
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
