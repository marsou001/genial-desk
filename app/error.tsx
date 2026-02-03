"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white/80 p-8 shadow-xl border border-white/10 text-center">
        <div className="mb-4 text-4xl">⚠️</div>

        <h1 className="text-2xl font-semibold text-slate-800 mb-2">
          Something went wrong
        </h1>

        <p className="text-gray-600 mb-6">
          An unexpected error occurred. You can try again, or refresh the page.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <pre className="mb-6 max-h-48 overflow-auto rounded-lg bg-black/80 p-3 text-left text-xs text-red-400">
            {error.message}
          </pre>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition"
          >
            Try again
          </button>

          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-black border border-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-black/80 transition"
          >
            Reload page
          </button>
        </div>
      </div>
    </div>
  );
}
