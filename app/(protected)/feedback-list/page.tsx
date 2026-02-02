import FeedbackList from "@/components/interfaces/FeedbackList/FeedbackList";
import { Feedback } from "@/types/database";

export default async function FeedbackListPage() {
  let feedbacks: Feedback[];

  try {
    const response = await fetch(`/api/feedbacks`);
    const data = await response.json();
    feedbacks = data.feedbacks || [];
  } catch (error) {
    console.error('Failed to fetch feedbacks:', error);
    throw new Error('Failed to fetch feedbacks')
  }

  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-600 dark:text-zinc-400">No feedback found. Upload some feedback to get started!</p>
      </div>
    );
  }

  return <FeedbackList feedbacks={feedbacks} />
}