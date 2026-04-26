import Link from "next/link";
import { usePermissions } from "@/context/permissions-context";

export default function NoFeedbackFound({
  organizationId,
}: {
  organizationId: string;
}) {
  const canUploadFeedback = usePermissions("data:create");

  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
          No feedback in this period
        </h2>

        {canUploadFeedback ? (
          <>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              No feedback found for the selected period. Try a different time
              range or upload a CSV file to start analyzing customer feedback
              with AI.
            </p>
            <Link
              href={`/organizations/${organizationId}/upload`}
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Upload Feedback →
            </Link>
          </>
        ) : (
          <p className="text-zinc-600 dark:text-zinc-400">
            No feedback found for the selected period. Try a different time
            range.
          </p>
        )}
      </div>
    </div>
  );
}
