'use client';

import { useState } from 'react';
import { Feedback } from '@/types/database';
import FeedbackCard from './FeedbackCard';

export default function FeedbackList({ feedbacks }: { feedbacks: Feedback[]}) {
  const [filter, setFilter] = useState<{ topic?: string; sentiment?: string }>({});

  const filteredSentiments = feedbacks.filter((feedback) => {
    if (filter.topic === undefined || filter.topic.length === 0 ) {
      return true
    } else {
      return feedback.topic === filter.topic
    }
  }).filter((feedback) => {
    if (filter.sentiment === undefined || filter.sentiment.length === 0 ) {
      return true
    } else {
      return feedback.sentiment === filter.sentiment
    }
  })

  function resetFilters() {
    setFilter({ topic: "", sentiment: "" })
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

      {filteredSentiments.length === 0 ? (
        <div className="text-center pt-4">
          <h2 className="mb-4">No results were found with the selected topic and sentiment</h2>
          <button
            type="button"
            onClick={resetFilters}
            className="bg-blue-300 px-4 py-3 rounded-lg"
          >Reset filters</button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSentiments.map((feedback) => (
            <FeedbackCard key={feedback.id} feedback={feedback} />
          ))}
        </div>
      )}

    </div>
  );
}
