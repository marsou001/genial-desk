"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Feedback } from "@/types/database";
import { getFeedbacks } from "@/lib/api/feedbacks";
import FeedbackCard from "./FeedbackCard";
import DropdownPeriodSelection from "@/components/common/DropdownPeriodSelection";

export default function FeedbackList({
  feedbacks,
  organizationId,
}: {
  feedbacks: Feedback[];
  organizationId: string;
}) {
  const [allFeedbacks, setAllFeedbacks] = useState<Feedback[]>(feedbacks);
  const [isFetching, setIsFetching] = useState(false);
  const [_, startTransition] = useTransition();
  const [filter, setFilter] = useState<{ topic?: string; sentiment?: string }>(
    {},
  );

  async function fetchFeedbacksByPeriod(period: number) {
    setIsFetching(true);

    try {
      const newFeedbacks = await getFeedbacks(organizationId, period);
      startTransition(() => {
        setAllFeedbacks(newFeedbacks);
      });
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch feedbacks",
      );
      return false;
    } finally {
      setIsFetching(false);
    }
  }

  const filteredFeedbacks = allFeedbacks
    .filter((feedback) => {
      if (filter.topic === undefined || filter.topic.length === 0) {
        return true;
      } else {
        return feedback.topic === filter.topic;
      }
    })
    .filter((feedback) => {
      if (filter.sentiment === undefined || filter.sentiment.length === 0) {
        return true;
      } else {
        return feedback.sentiment === filter.sentiment;
      }
    });

  function resetFilters() {
    setFilter({ topic: "", sentiment: "" });
  }

  const hasFilters =
    (filter.topic !== undefined && filter.topic.length > 0) ||
    (filter.sentiment !== undefined && filter.sentiment.length > 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex gap-2 flex-wrap">
          <select
            value={filter.topic || ""}
            onChange={(e) =>
              setFilter({ ...filter, topic: e.target.value || undefined })
            }
            className="px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
          >
            <option value="">All Topics</option>
            {Array.from(new Set(allFeedbacks.map((f) => f.topic))).map(
              (topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ),
            )}
          </select>
          <select
            value={filter.sentiment || ""}
            onChange={(e) =>
              setFilter({ ...filter, sentiment: e.target.value || undefined })
            }
            className="px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
          >
            <option value="">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
        </div>
        <DropdownPeriodSelection
          fetchData={fetchFeedbacksByPeriod}
          disabled={isFetching}
        />
      </div>

      {filteredFeedbacks.length === 0 ? (
        <div className="text-center pt-4">
          {hasFilters ? (
            <>
              <h2 className="mb-4">
                No results were found with the selected topic and sentiment
              </h2>
              <button
                type="button"
                onClick={resetFilters}
                className="bg-blue-300 px-4 py-3 rounded-lg"
              >
                Reset filters
              </button>
            </>
          ) : (
            <p className="text-zinc-600 dark:text-zinc-400">
              No feedback found. Upload some feedback to get started!
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFeedbacks.map((feedback) => (
            <FeedbackCard key={feedback.id} feedback={feedback} />
          ))}
        </div>
      )}
    </div>
  );
}
