"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { CountryStat } from "@/lib/api";

interface Props {
  countries: CountryStat[];
}

export function TopCountriesChart({ countries }: Props) {
  const top10 = countries.slice(0, 10);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Top 10 Content Producing Nations</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Total catalog volume by country of origin</p>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40 font-medium">
          Global Distribution
        </span>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={top10}
            margin={{ top: 5, right: 20, left: 35, bottom: 5 }}
          >
            <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis
              dataKey="country"
              type="category"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              width={85}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload as CountryStat;
                  return (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl shadow-xl text-xs space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white">{d.country}</p>
                      <p className="text-red-600 dark:text-red-400 font-medium">Movies: {d.movies_count.toLocaleString()}</p>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">TV Shows: {d.tv_shows_count.toLocaleString()}</p>
                      <p className="text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800 pt-1 font-semibold">
                        Total: {d.total_shows.toLocaleString()} ({d.percentage_of_total}% share)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              height={30}
              formatter={(value) => (
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {value === "movies_count" ? "Movies" : "TV Shows"}
                </span>
              )}
            />
            <Bar dataKey="movies_count" stackId="a" fill="#E50914" radius={[0, 0, 0, 0]} />
            <Bar dataKey="tv_shows_count" stackId="a" fill="#3B82F6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
