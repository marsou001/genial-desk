"use client";

import { useSearchParams } from "next/navigation";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Insights as InsightsData } from "@/types";
import {
  getInsights,
  generateInsights as _generateInsights,
} from "@/lib/api/organizations-insights";
import { formatRelativeTime } from "@/lib/utils";
import DropdownPeriodSelection from "@/components/common/DropdownPeriodSelection";
import ButtonWithTooltip from "@/components/common/ButtonWithTooltip";
import DownloadPDFReport from "@/components/common/DownloadPDFReport";

export default function Insights({
  insightsData,
  organizationId,
  remainingAIRuns,
}: {
  insightsData: InsightsData;
  organizationId: string;
  remainingAIRuns: number;
}) {
  const [insights, setInsights] = useState<InsightsData>(insightsData);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingRuns, setRemainingRuns] = useState(remainingAIRuns);
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);

  const period = searchParams.get("period") ?? "30";
  const hasInsightCredits = remainingRuns >= 2;
  const insightLimitTooltip = hasInsightCredits
    ? undefined
    : `Generating insights requires 2 AI runs. You have ${remainingRuns} remaining.`;
  const lastGenerated = insights?.data
    ? formatRelativeTime(new Date(insights.lastGenerated).toISOString())
    : null;

  async function fetchInsights(period: number) {
    setIsLoading(true);
    try {
      const data = await getInsights(organizationId, period);
      setInsights(data);
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch insights",
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function generateInsights() {
    setIsLoading(true);
    try {
      const data = await _generateInsights(organizationId, Number(period));
      setInsights(data);
      setRemainingRuns((currentRuns) => Math.max(0, currentRuns - 2));
      toast.success("Insights refreshed");
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch insights",
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-3 mb-4 sm:mb-8">
        <DropdownPeriodSelection
          disabled={isLoading}
          fetchData={fetchInsights}
        />
        {insights.data !== null && (
          <DownloadPDFReport
            period={Number(period)}
            contentRef={contentRef}
            reportTitle="Insights Report"
            disabled={isLoading}
          />
        )}
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">Loading...</div>
      ) : insights.data === null ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col justify-center">
            <p className="text-zinc-600 dark:text-zinc-200 text-center">
              No insights were generated for a {period} days period.
            </p>
            <ButtonWithTooltip
              onClick={generateInsights}
              disabled={isLoading || !hasInsightCredits}
              tooltip={insightLimitTooltip}
              wrapperClassName="mt-6 block mx-auto"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg cursor-pointer disabled:bg-blue-800 disabled:bg-zinc-400 disabled:cursor-not-allowed transition-colors"
            >
              Generate Insights
            </ButtonWithTooltip>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-8 rounded-lg border border-blue-200 dark:border-blue-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Insights for the last {insights.period}
            </h2>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Generated {lastGenerated}
            </div>
          </div>
          <div ref={contentRef} className="prose prose-sm max-w-none dark:prose-invert">
            <div className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
              {insights.data.split("\n").map((paragraph, i) => (
                <p key={i} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <ButtonWithTooltip
            onClick={generateInsights}
            disabled={isLoading || !hasInsightCredits}
            tooltip={insightLimitTooltip}
            wrapperClassName="mt-6 block"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg cursor-pointer disabled:bg-zinc-400 disabled:cursor-not-allowed transition-colors"
          >
            Refresh Insights
          </ButtonWithTooltip>
        </div>
      )}
    </>
  );
}
