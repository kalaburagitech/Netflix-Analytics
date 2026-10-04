"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { TrendItem } from "@/lib/api";

interface Props {
  trends: TrendItem[];
}

export function TrendsChart({ trends }: Props) {
  // Focus on modern streaming era (2000 onwards) for clarity, with smooth curves
  const filteredData = trends.filter((t) => t.year >= 2000 && t.year <= 2021);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Historical Release Trajectory</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Annual production output (2000 – 2021)</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 dark:bg-red-500" /> Movies
          </span>
          <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 dark:bg-amber-400" /> TV Shows
          </span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="movieGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E50914" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#E50914" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="tvGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#64748b" strokeOpacity={0.2} vertical={false} />
            <XAxis dataKey="year" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl shadow-xl text-xs space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white">Year: {label}</p>
                      <p className="text-red-600 dark:text-red-400 font-medium">Movies: {payload[0]?.value} titles</p>
                      <p className="text-amber-600 dark:text-amber-400 font-medium">TV Shows: {payload[1]?.value} titles</p>
                      <p className="text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-1 font-semibold">
                        Total Output: {Number(payload[0]?.value || 0) + Number(payload[1]?.value || 0)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="movies"
              stroke="#E50914"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#movieGradient)"
            />
            <Area
              type="monotone"
              dataKey="tv_shows"
              stroke="#F59E0B"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#tvGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
