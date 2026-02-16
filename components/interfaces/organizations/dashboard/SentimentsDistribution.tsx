"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Stats } from '@/types';

const COLORS = {
  positive: '#10b981',
  neutral: '#6b7280',
  negative: '#ef4444',
};

export default function SentimentsDistribution({ stats }: { stats: Stats }) {
  const sentimentData = [
    { name: 'Positive', value: stats.bySentiment.positive, color: COLORS.positive },
    { name: 'Neutral', value: stats.bySentiment.neutral, color: COLORS.neutral },
    { name: 'Negative', value: stats.bySentiment.negative, color: COLORS.negative },
  ].filter(item => item.value > 0);

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
        Sentiment Distribution
      </h3>
      {sentimentData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={sentimentData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {sentimentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[300px] text-zinc-600 dark:text-zinc-400">
          No sentiment data available
        </div>
      )}
    </div>
  )
}