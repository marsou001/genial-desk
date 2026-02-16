'use client';

import { useState } from 'react';
import CSVUpload from './CSVUpload';
import ManualFeedbackForm from './ManualFeedbackForm';

type TabKey = 'csv' | 'manual';

const TABS: { key: TabKey; label: string; description: string }[] = [
  {
    key: 'csv',
    label: 'Bulk CSV Upload',
    description: 'Import many feedback items at once from support tools, surveys, or exports.',
  },
  {
    key: 'manual',
    label: 'Manual Entry',
    description: 'Capture individual customer quotes from calls, chats, or interviews.',
  },
];

export default function UploadTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>('csv');

  const activeConfig = TABS.find((tab) => tab.key === activeTab)!;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-xl bg-gradient-to-r from-blue-600/10 via-blue-500/5 to-emerald-500/10 p-4 border border-blue-500/10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              Ingestion Mode
            </p>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
              Choose how you want to bring customer feedback into GenialDesk.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="inline-flex h-6 items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 font-medium text-emerald-700 dark:text-emerald-300">
              AI-powered analysis
            </span>
          </div>
        </div>

        <div className="mt-3 inline-flex rounded-full bg-zinc-100/70 p-1 text-xs dark:bg-zinc-800/80">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-50'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          {activeConfig.description}
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/60 p-4 dark:border-zinc-700 dark:bg-zinc-900/40">
        {activeTab === 'csv' ? <CSVUpload /> : <ManualFeedbackForm />}
      </div>
    </div>
  );
}

