import Link from "next/link";
import { Stats } from "@/types";
import SummaryCards from "@/components/interfaces/dashboard/SummaryCards";
import ChartsGrid from "@/components/interfaces/dashboard/ChartsGrid";
import SentimentsDistribution from "@/components/interfaces/dashboard/SentimentsDistribution";

export default async function Dashboard() {
  let stats: Stats;

  try {
    const response = await fetch('/api/stats');
    stats = await response.json();
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    throw new Error('Failed to fetch stats')
  }

  if (stats.total === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            Welcome to GenialDesk!
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Upload your first CSV file to start analyzing customer feedback with AI.
          </p>
          <Link
            href="/upload"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Upload Feedback →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SummaryCards stats={stats} />
      <ChartsGrid stats={stats} />
      <SentimentsDistribution stats={stats} />
    </div>
  );
}
