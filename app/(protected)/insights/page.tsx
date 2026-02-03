import Insights from "@/components/interfaces/Insights/Insights";
import { fetchInsights } from "@/data/fetchInsights";

export default async function InsightsPage() {
  let insights = await fetchInsights()

  if (!insights) {
    return (
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <p className="text-zinc-600 dark:text-zinc-400">No insights available yet.</p>
      </div>
    );
  }

  return <Insights insightsData={insights} />
}