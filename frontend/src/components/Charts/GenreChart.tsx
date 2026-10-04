"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { GenreStat } from "@/lib/api";

interface Props {
  genres: GenreStat[];
}

export function GenreChart({ genres }: Props) {
  const topGenres = genres.slice(0, 10);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Top 10 Genres Portfolio</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Total catalog entries per genre classification</p>
        </div>
        <span className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 dark:text-indigo-400 dark:bg-indigo-950/40 dark:border-indigo-800/40 px-2.5 py-0.5 rounded-full font-medium">
          Multi-Category Tagging
        </span>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={topGenres}
            margin={{ top: 5, right: 20, left: 55, bottom: 5 }}
          >
            <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis
              dataKey="genre"
              type="category"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              width={110}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const g = payload[0].payload as GenreStat;
                  return (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl shadow-xl text-xs space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white">{g.genre}</p>
                      <p className="text-slate-600 dark:text-slate-300 font-semibold">Total: {g.total_count.toLocaleString()}</p>
                      <p className="text-red-600 dark:text-red-400 font-medium">Movies: {g.movies_count.toLocaleString()}</p>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">TV Shows: {g.tv_shows_count.toLocaleString()}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="total_count" radius={[0, 6, 6, 0]}>
              {topGenres.map((_, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={i === 0 ? "#E50914" : i < 3 ? "#DC2626" : "#64748B"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
