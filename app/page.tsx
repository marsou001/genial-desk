'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import CSVUpload from '@/components/CSVUpload';
import WeeklyInsights from '@/components/WeeklyInsights';
import FeedbackList from '@/components/FeedbackList';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard onNavigateToUpload={() => setActiveTab('upload')} />}
        {activeTab === 'upload' && <CSVUpload />}
        {activeTab === 'insights' && <WeeklyInsights />}
        {activeTab === 'feedback' && <FeedbackList />}
      </main>
    </div>
  );
}
