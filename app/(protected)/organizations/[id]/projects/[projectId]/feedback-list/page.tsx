import FeedbackList from "@/components/interfaces/organizations/projects/FeedbackList/FeedbackList";
import { fetchFeedbacks } from "@/data/fetchFeedbacks";

export default async function FeedbackListPage({
  params,
}: {
  params: Promise<{ id: string; projectId: string }>;
}) {
  const { id: organizationId, projectId } = await params;
  const feedbacks = await fetchFeedbacks(organizationId, projectId);

  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-600 dark:text-zinc-400">No feedback found. Upload some feedback to get started!</p>
      </div>
    );
  }

  return <FeedbackList feedbacks={feedbacks} />
}
