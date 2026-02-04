import UploadTabs from "@/components/interfaces/upload/UploadTabs";

export default function UploadPage() {
  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Bring customer feedback into GenialDesk
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Upload feedback in bulk from CSV exports or capture individual customer quotes manually.
          Every entry is enriched with AI-powered topics, sentiment, and summaries.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 items-center rounded-full border border-zinc-300 bg-white px-2 text-[11px] font-medium uppercase tracking-wide text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
            1. Ingest feedback
          </span>
          <span className="hidden sm:inline text-zinc-500 dark:text-zinc-400">
            2. Explore insights &nbsp;•&nbsp; 3. Share with your team
          </span>
        </div>
        <p className="flex-1 text-right text-[11px] text-zinc-500 dark:text-zinc-500">
          Need a sample file?{" "}
          <a
            href="/sample-feedback.csv"
            download
            className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Download CSV template
          </a>
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white/90 p-5 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <UploadTabs />
      </div>
    </section>
  )
}