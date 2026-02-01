'use client';

import { useEffect, useState } from 'react';
import { Feedback } from '@/types/database';

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{ topic?: string; sentiment?: string }>({});

  useEffect(() => {
    fetchFeedbacks();
  }, [filter]);

  const fetchFeedbacks = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.topic) params.append('topic', filter.topic);
      if (filter.sentiment) params.append('sentiment', filter.sentiment);

      const response = await fetch(`/api/feedbacks?${params.toString()}`);
      const data = await response.json();
      setFeedbacks(data.feedbacks || []);
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-zinc-600 dark:text-zinc-400">Loading feedback...</div>
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-600 dark:text-zinc-400">No feedback found. Upload some feedback to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <select
          value={filter.topic || ''}
          onChange={(e) => setFilter({ ...filter, topic: e.target.value || undefined })}
          className="px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
        >
          <option value="">All Topics</option>
          {Array.from(new Set(feedbacks.map(f => f.topic))).map(topic => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>
        <select
          value={filter.sentiment || ''}
          onChange={(e) => setFilter({ ...filter, sentiment: e.target.value || undefined })}
          className="px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
        >
          <option value="">All Sentiments</option>
          <option value="positive">Positive</option>
          <option value="neutral">Neutral</option>
          <option value="negative">Negative</option>
        </select>
      </div>

      <div className="space-y-3">
        {feedbacks.map((feedback) => (
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
        ))}
      </div>
    </div>
  );
}
