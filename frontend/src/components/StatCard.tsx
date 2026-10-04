import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: string;
  gradient?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  badgeColor = "text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/60 dark:border-emerald-800/40",
}: StatCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800/80 dark:bg-slate-900/70 p-5 shadow-sm dark:shadow-xl transition-all duration-300 hover:shadow-md dark:hover:border-slate-700 hover:translate-y-[-2px]"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {typeof value === "number" ? value.toLocaleString() : value}
          </h3>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 border border-red-100 dark:bg-slate-800/80 dark:border-slate-700/60 shadow-sm">
            <Icon className="h-5 w-5 text-red-600 dark:text-red-500" />
          </div>
          {badge && (
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${badgeColor}`}
            >
              {badge}
            </span>
          )}
        </div>
      </div>
      <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-red-600/5 blur-2xl pointer-events-none" />
    </div>
  );
}
