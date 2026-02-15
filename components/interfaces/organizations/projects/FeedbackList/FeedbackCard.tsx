import { Feedback } from "@/types/database";

export default function FeedbackCard({ feedback }: { feedback: Feedback }) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300';
    }
  };

  return (
    <div
      key={feedback.id}
      className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-2 flex-wrap">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getSentimentColor(feedback.sentiment)}`}>
            {feedback.sentiment}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {feedback.topic}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {feedback.source}
          </span>
        </div>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {new Date(feedback.created_at).toLocaleDateString()}
        </span>
      </div>
      <p className="text-zinc-900 dark:text-zinc-50 mb-2">{feedback.text}</p>
      {feedback.summary && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400 italic">
          Summary: {feedback.summary}
        </p>
      )}
      {feedback.keywords && feedback.keywords.length > 0 && (
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {feedback.keywords.map((keyword, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded text-xs bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            >
              {keyword}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}