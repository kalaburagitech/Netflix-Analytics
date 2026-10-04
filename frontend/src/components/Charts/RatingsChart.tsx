"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { RatingStat } from "@/lib/api";

interface Props {
  ratings: RatingStat[];
}

const COLORS = [
  "#E50914", "#EF4444", "#F97316", "#F59E0B", "#10B981",
  "#06B6D4", "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899"
];

export function RatingsChart({ ratings }: Props) {
  const topRatings = ratings.slice(0, 8);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Content Maturity Ratings</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Distribution across censorship categories</p>
        </div>
        <span className="text-xs text-red-700 bg-red-50 border border-red-200 dark:text-red-400 dark:bg-red-950/40 dark:border-red-900/30 px-2.5 py-0.5 rounded-full font-medium">
          TV-MA Leads ({topRatings[0]?.percentage || 36.4}%)
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topRatings} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="rating" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as RatingStat;
                  return (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl shadow-xl text-xs space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white">{item.rating}</p>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">Audience: {item.target_audience}</p>
                      <p className="text-red-600 dark:text-red-400 font-mono font-semibold">
                        {item.count.toLocaleString()} titles ({item.percentage}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {topRatings.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-800">
        <span>Adults: TV-MA / R</span>
        <span>Teens: TV-14 / PG-13</span>
        <span>Family: TV-PG / TV-Y</span>
      </div>
    </div>
  );
}
