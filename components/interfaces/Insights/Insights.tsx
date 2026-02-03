"use client";

import { useState } from "react";
import { Insights as InsightsData } from "@/types";

export default function Insights({ insightsData }: { insightsData: InsightsData}) {
  const [insights, setInsights] = useState(insightsData)
  const [loading, setLoading] = useState(false)

  async function fetchInsights() {
    try {
      const response = await fetch('/api/insights/weekly?days=7');
      const data = await response.json();
      setInsights(data);
    } catch {
      // TODO: toast error message
      console.error('Failed to fetch insights:');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-8 rounded-lg border border-blue-200 dark:border-blue-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Weekly Insights
        </h2>
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          {insights.count} feedback items • Last {insights.period}
        </div>
      </div>
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <div className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
          {insights.data.split('\n').map((paragraph, i) => (
            <p key={i} className="mb-4 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      <button
        onClick={fetchInsights}
        className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Refresh Insights
      </button>
    </div>
  )
}