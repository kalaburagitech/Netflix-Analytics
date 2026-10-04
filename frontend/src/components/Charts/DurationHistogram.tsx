"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface DurationBin {
  bin_range: string;
  min_val: number;
  max_val: number;
  count: number;
}

interface Props {
  bins: DurationBin[];
  avgDuration: number;
  medianDuration: number;
}

export function DurationHistogram({ bins, avgDuration, medianDuration }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Movie Duration Distribution</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Runtime frequency analysis (Average: {avgDuration}m | Median: {medianDuration}m)
          </p>
        </div>
        <span className="text-xs text-purple-700 bg-purple-50 border border-purple-200 dark:text-purple-400 dark:bg-purple-950/40 dark:border-purple-800/40 px-2.5 py-0.5 rounded-full font-medium">
          90-110m Sweet Spot
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bins} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="bin_range" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const b = payload[0].payload as DurationBin;
                  return (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl shadow-xl text-xs space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white">{b.bin_range}</p>
                      <p className="text-purple-600 dark:text-purple-400 font-mono font-semibold">
                        {b.count.toLocaleString()} movies
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                        Range: {b.min_val} to {b.max_val} minutes
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {bins.map((b, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={b.min_val >= 90 && b.max_val <= 120 ? "#8B5CF6" : "#A78BFA"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-800">
        <span>Short Films (&lt; 45m)</span>
        <span className="text-purple-600 dark:text-purple-300 font-semibold">Standard Feature (90-110m)</span>
        <span>Epics (&gt; 150m)</span>
      </div>
    </div>
  );
}
