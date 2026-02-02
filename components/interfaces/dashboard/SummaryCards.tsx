import { Stats } from "@/types";

export default function SummaryCards({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Total Feedback</p>
        <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{stats.total}</p>
      </div>
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Positive</p>
        <p className="text-3xl font-bold text-green-600">{stats.bySentiment.positive}</p>
      </div>
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Neutral</p>
        <p className="text-3xl font-bold text-zinc-600 dark:text-zinc-400">{stats.bySentiment.neutral}</p>
      </div>
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Negative</p>
        <p className="text-3xl font-bold text-red-600">{stats.bySentiment.negative}</p>
      </div>
    </div>
  )
}