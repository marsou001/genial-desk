"use client";

import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertCircle, CheckCircle2, Lightbulb } from 'lucide-react';

const sentimentData = [
  { name: 'Jan', score: 72 },
  { name: 'Feb', score: 75 },
  { name: 'Mar', score: 71 },
  { name: 'Apr', score: 68 },
  { name: 'May', score: 58 },
];

const distributionData = [
  { name: 'Positive', value: 42, color: '#00B341' },
  { name: 'Neutral', value: 31, color: '#FF9500' },
  { name: 'Negative', value: 27, color: '#FF3B30' },
];

const topIssues = [
  { rank: 1, theme: 'Onboarding complexity', count: 327, sentiment: 'negative' },
  { rank: 2, theme: 'Slow support response', count: 184, sentiment: 'negative' },
  { rank: 3, theme: 'Export functionality', count: 156, sentiment: 'negative' },
  { rank: 4, theme: 'Mobile app performance', count: 142, sentiment: 'negative' },
];

const topPraise = [
  { rank: 1, theme: 'Dashboard usability', count: 412, sentiment: 'positive' },
  { rank: 2, theme: 'Export features', count: 298, sentiment: 'positive' },
  { rank: 3, theme: 'Customer support quality', count: 267, sentiment: 'positive' },
];

export function DashboardMockup() {
  return (
    <div className="w-full bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2A2A2A]">
        <div>
          <h3 className="text-white font-semibold text-lg">Feedback Analysis</h3>
          <p className="text-[#6B6B6B] text-sm mt-1">May 2026 • 2,847 responses</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FF3B3010] border border-[#FF3B30] rounded-md">
          <div className="w-2 h-2 bg-[#FF3B30] rounded-full"></div>
          <span className="text-[#FF3B30] text-sm font-medium">Sentiment declined 18%</span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sentiment Distribution */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#0066FF20] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#0066FF]" />
            </div>
            <h4 className="text-white font-medium text-sm">Sentiment Distribution</h4>
          </div>
          <div className="h-40 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-around mt-4 pt-4 border-t border-[#2A2A2A]">
            {distributionData.map((item) => (
              <div key={item.name} className="text-center">
                <div className="text-xs text-[#6B6B6B] mb-1">{item.name}</div>
                <div className="text-white font-semibold text-sm" style={{ color: item.color }}>
                  {item.value}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Trend */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4 col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#0066FF20] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#0066FF]" />
            </div>
            <h4 className="text-white font-medium text-sm">Sentiment Trend</h4>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={sentimentData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0066FF" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#0066FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" strokeOpacity={0.3} />
              <XAxis dataKey="name" stroke="#6B6B6B" style={{ fontSize: '11px' }} />
              <YAxis stroke="#6B6B6B" style={{ fontSize: '11px' }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #2A2A2A',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#FFFFFF' }}
                itemStyle={{ color: '#0066FF' }}
              />
              <Area type="monotone" dataKey="score" stroke="#0066FF" strokeWidth={2} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Negative Themes */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4 col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#FF3B3020] flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-[#FF3B30]" />
            </div>
            <h4 className="text-white font-medium text-sm">Top Customer Issues</h4>
          </div>
          <div className="space-y-3">
            {topIssues.map((issue) => (
              <div key={issue.rank} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#FF3B3020] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#FF3B30] text-xs font-semibold">{issue.rank}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{issue.theme}</div>
                  <div className="text-[#6B6B6B] text-xs">{issue.count} mentions</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="bg-[#0066FF15] border border-[#0066FF40] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#0066FF30] flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-[#0066FF]" />
            </div>
            <h4 className="text-white font-medium text-sm">Top Priority</h4>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-[#0066FF] font-medium mb-1">ACTION NEEDED</div>
              <div className="text-white text-sm font-medium mb-2">
                Simplify onboarding flow
              </div>
              <div className="text-[#A3A3A3] text-xs leading-relaxed">
                41% of negative feedback mentions onboarding complexity
              </div>
            </div>
            <div className="flex gap-2 pt-3 border-t border-[#0066FF30]">
              <span className="px-2 py-1 bg-[#00B34120] text-[#00B341] text-xs rounded font-medium">
                High Impact
              </span>
              <span className="px-2 py-1 bg-[#FF950020] text-[#FF9500] text-xs rounded font-medium">
                Med Effort
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Positive Themes */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4 mt-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#00B34120] flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-[#00B341]" />
          </div>
          <h4 className="text-white font-medium text-sm">What Customers Love</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topPraise.map((praise) => (
            <div key={praise.rank} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#00B34120] flex items-center justify-center flex-shrink-0">
                <span className="text-[#00B341] text-xs font-semibold">{praise.rank}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">{praise.theme}</div>
                <div className="text-[#6B6B6B] text-xs">{praise.count} mentions</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
