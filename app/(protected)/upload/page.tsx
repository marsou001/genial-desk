import CSVUpload from "@/components/interfaces/upload/CSVUpload";

export default function UploadPage() {
  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
        Upload Feedback CSV
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
        Upload a CSV file with customer feedback. We'll automatically analyze it with AI.
      </p>
      <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-6">
        Need a sample file?{' '}
        <a
          href="/sample-feedback.csv"
          download
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
        >
          Download sample CSV
        </a>
      </p>

      <CSVUpload />
    </div>
  )
}