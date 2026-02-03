import Insights from "@/components/interfaces/Insights/Insights";
import { Insights as InsightsData } from "@/types";

export default async function InsightsPage() {
  let insights: InsightsData;

  try {
    const response = await fetch('/api/insights/weekly?days=7');
    insights = await response.json();
  } catch (error) {
    console.error('Failed to fetch insights:', error);
    throw new Error('Failed to fetch insights')
  }

  if (!insights) {
    return (
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <p className="text-zinc-600 dark:text-zinc-400">No insights available yet.</p>
      </div>
    );
  }

  return <Insights insightsData={insights} />
}