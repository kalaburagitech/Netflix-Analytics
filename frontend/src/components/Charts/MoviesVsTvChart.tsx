"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface Props {
  moviesCount: number;
  tvShowsCount: number;
}

export function MoviesVsTvChart({ moviesCount, tvShowsCount }: Props) {
  const data = [
    { name: "Movies", value: moviesCount, color: "#E50914" },
    { name: "TV Shows", value: tvShowsCount, color: "#3B82F6" },
  ];

  const total = moviesCount + tvShowsCount;
  const moviePct = total ? ((moviesCount / total) * 100).toFixed(1) : 0;
  const tvPct = total ? ((tvShowsCount / total) * 100).toFixed(1) : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Content Type Ratio</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Movies vs TV Shows Catalog Breakdown</p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 font-mono font-medium">
          {total.toLocaleString()} Titles
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0];
                  const pct = total ? (((item.value as number) / total) * 100).toFixed(1) : 0;
                  return (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl shadow-xl text-xs space-y-0.5">
                      <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                      <p className="text-slate-600 dark:text-slate-300">
                        {Number(item.value).toLocaleString()} titles ({pct}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-auto pt-2 border-t border-slate-200 dark:border-slate-800/80">
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-900/30 text-center">
          <p className="text-[11px] text-red-600 dark:text-red-400 font-semibold uppercase">Movies Share</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">{moviePct}%</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">{moviesCount.toLocaleString()} total</p>
        </div>
        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/30 text-center">
          <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold uppercase">TV Shows Share</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">{tvPct}%</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">{tvShowsCount.toLocaleString()} total</p>
        </div>
      </div>
    </div>
  );
}
