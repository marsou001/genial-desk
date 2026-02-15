import Link from "next/link";
import SummaryCards from "@/components/interfaces/organizations/projects/dashboard/SummaryCards";
import ChartsGrid from "@/components/interfaces/organizations/projects/dashboard/ChartsGrid";
import SentimentsDistribution from "@/components/interfaces/organizations/projects/dashboard/SentimentsDistribution";
import { fetchStats } from "@/data/fetchStats";

export default async function Dashboard({
  params,
}: {
  params: Promise<{ id: string; projectId: string }>;
}) {
  const { id: organizationId, projectId } = await params;
  const stats = await fetchStats(organizationId, projectId);

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
            href={`/organizations/${organizationId}/projects/${projectId}/upload`}
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
