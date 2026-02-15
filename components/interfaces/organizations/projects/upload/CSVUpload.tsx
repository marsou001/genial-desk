'use client';

import { useState } from 'react';

interface UploadResult {
  success: boolean;
  processed: number;
  errors?: string[];
  feedbacks?: any[];
}

export default function CSVUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState('CSV Upload');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setResult(null);

    try {
      const pathMatch = window.location.pathname.match(/\/organizations\/([^/]+)\/projects\/([^/]+)/);
      const orgId = pathMatch?.[1] || '';
      const projectId = pathMatch?.[2] || null;

      if (!orgId || !projectId) {
        setResult({
          success: false,
          processed: 0,
          errors: ['Organization and project context not found. Open this page from a project.'],
        });
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('source', source);
      formData.append('project_id', projectId);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'x-organization-id': orgId,
          'x-project-id': projectId,
        },
        body: formData,
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        // Refresh the page to show new data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      setResult({
        success: false,
        processed: 0,
        errors: [error instanceof Error ? error.message : 'Upload failed'],
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Source Name
        </label>
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Support Tickets, Survey Responses"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          CSV File
        </label>
        <div className="flex items-center gap-4">
          <label className="flex-1 cursor-pointer">
            <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg hover:border-blue-500 transition-colors">
              {file ? (
                <div className="text-center">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {file.name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Click to select or drag and drop
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    CSV files only
                  </p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
      >
        {uploading ? 'Processing...' : 'Upload & Analyze'}
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
            className={`font-medium ${
              result.success
                ? 'text-green-800 dark:text-green-200'
                : 'text-red-800 dark:text-red-200'
            }`}
          >
            {result.success
              ? `✅ Successfully processed ${result.processed} feedback items!`
              : `❌ Upload failed`}
          </p>
          {result.errors && result.errors.length > 0 && (
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
              <p className="font-medium">Errors:</p>
              <ul className="list-disc list-inside mt-1">
                {result.errors.slice(0, 5).map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
