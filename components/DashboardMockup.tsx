"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const volumeData = [
  { date: "2026-05-07", count: 85 },
  { date: "2026-05-08", count: 92 },
  { date: "2026-05-09", count: 78 },
  { date: "2026-05-10", count: 64 },
  { date: "2026-05-11", count: 71 },
  { date: "2026-05-12", count: 88 },
  { date: "2026-05-13", count: 95 },
  { date: "2026-05-14", count: 102 },
  { date: "2026-05-15", count: 110 },
  { date: "2026-05-16", count: 97 },
  { date: "2026-05-17", count: 84 },
  { date: "2026-05-18", count: 76 },
  { date: "2026-05-19", count: 91 },
  { date: "2026-05-20", count: 86 },
  { date: "2026-05-21", count: 73 },
  { date: "2026-05-22", count: 68 },
  { date: "2026-05-23", count: 82 },
  { date: "2026-05-24", count: 94 },
  { date: "2026-05-25", count: 103 },
  { date: "2026-05-26", count: 115 },
  { date: "2026-05-27", count: 108 },
  { date: "2026-05-28", count: 96 },
  { date: "2026-05-29", count: 89 },
  { date: "2026-05-30", count: 77 },
  { date: "2026-05-31", count: 83 },
  { date: "2026-06-01", count: 91 },
  { date: "2026-06-02", count: 99 },
  { date: "2026-06-03", count: 87 },
  { date: "2026-06-04", count: 76 },
  { date: "2026-06-05", count: 68 },
];

const topTopics = [
  { topic: "Onboarding", count: 327 },
  { topic: "Support Speed", count: 184 },
  { topic: "Export", count: 156 },
  { topic: "Mobile App", count: 142 },
  { topic: "Pricing", count: 98 },
];

const sentimentData = [
  { name: "Positive", value: 1196, color: "#10b981" },
  { name: "Neutral", value: 882, color: "#6b7280" },
  { name: "Negative", value: 769, color: "#ef4444" },
];

export function DashboardMockup() {
  return (
    <div className="w-full space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
            Total Feedback
          </p>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            2,847
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
            Positive
          </p>
          <p className="text-3xl font-bold text-green-600">1,196</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Neutral</p>
          <p className="text-3xl font-bold text-zinc-600 dark:text-zinc-400">
            882
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
            Negative
          </p>
          <p className="text-3xl font-bold text-red-600">769</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume Over Time */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
            Feedback Volume (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Topics */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
            Top Topics This Month
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topTopics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="topic"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sentiment Distribution */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
          Sentiment Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={sentimentData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
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
      </div>
    </div>
  );
}
