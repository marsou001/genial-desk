"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { createFeedback } from "@/lib/api/feedbacks";
import ButtonWithTooltip from "@/components/common/ButtonWithTooltip";
import { toast } from "sonner";

export default function ManualFeedbackForm({
  remainingAIRuns,
  remainingUploads,
  onUploadConsumed,
}: {
  remainingAIRuns: number;
  remainingUploads: number;
  onUploadConsumed: () => void;
}) {
  const [source, setSource] = useState("Manual Entry");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { id: organizationId } = useParams();
  const hasUploadCredits = remainingUploads >= 1 && remainingAIRuns >= 1;
  const limitTooltip = !hasUploadCredits
    ? remainingUploads < 1 && remainingAIRuns < 1
      ? "You need at least 1 upload and 1 AI run remaining to submit feedback."
      : remainingUploads < 1
        ? "You need at least 1 upload remaining to submit feedback."
        : "You need at least 1 AI run remaining to submit feedback."
    : undefined;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setSubmitting(true);

    try {
      await createFeedback(
        String(organizationId),
        feedback.trim(),
        source.trim() || "Manual Entry",
      );
      toast.success("Feedback analyzed and added to your workspace.");
      setFeedback("");
      onUploadConsumed();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div>
          <label
            id="source"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Source Name
          </label>
          <input
            type="text"
            name="source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., In-app widget, Support call, Interview"
          />
        </div>

        <div>
          <label
            id="feedback"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Customer Feedback
          </label>
          <textarea
            name="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Paste or type the exact customer quote here..."
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            We&apos;ll analyze this single piece of feedback with AI and add it
            to your workspace.
          </p>
        </div>
      </div>

      <ButtonWithTooltip
        type="submit"
        disabled={!feedback.trim() || submitting || !hasUploadCredits}
        tooltip={limitTooltip}
        wrapperClassName="block w-full"
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
      >
        {submitting ? "Analyzing..." : "Analyze & Save Feedback"}
      </ButtonWithTooltip>
    </form>
  );
}
