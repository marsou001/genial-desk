'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

interface ManualFeedbackResult {
  success: boolean;
  error?: string;
}

export default function ManualFeedbackForm() {
  const [source, setSource] = useState('Manual Entry');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ManualFeedbackResult | null>(null);

  const { id: organizationId } = useParams()

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setSubmitting(true);
    setResult(null);

    try {
      const response = await fetch(`/api/organizations/${organizationId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: feedback.trim(),
          source: source.trim() || 'Manual Entry',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setResult({
          success: false,
          error: data.error || 'Failed to submit feedback',
        });
        return;
      }

      setResult({ success: true });
      setFeedback('');

      // Give the user a moment to read the success message before refresh
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit feedback',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Source Name
          </label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., In-app widget, Support call, Interview"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Customer Feedback
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Paste or type the exact customer quote here..."
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            We&apos;ll analyze this single piece of feedback with AI and add it to your workspace.
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={!feedback.trim() || submitting}
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
      >
        {submitting ? 'Analyzing...' : 'Analyze & Save Feedback'}
      </button>

      {result && (
        <div
          className={`p-4 rounded-lg ${
            result.success
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}
        >
          <p
            className={`text-sm font-medium ${
              result.success
                ? 'text-green-800 dark:text-green-200'
                : 'text-red-800 dark:text-red-200'
            }`}
          >
            {result.success
              ? '✅ Feedback analyzed and added to your workspace.'
              : result.error || 'Something went wrong while submitting your feedback.'}
          </p>
        </div>
      )}
    </form>
  );
}

