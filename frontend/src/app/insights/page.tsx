import { fetchInsights } from "@/lib/api";
import {
  Lightbulb,
  Globe,
  Film,
  ShieldCheck,
  TrendingUp,
  Target,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

export default async function InsightsPage() {
  const insightsData = await fetchInsights();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800/80 pb-6 transition-colors duration-200">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-900/40 uppercase tracking-wider">
            Automated Intelligence
          </span>
          <span className="text-xs text-slate-500">KalaburagiTech Strategic Engine</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Strategic Platform & Catalog Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
          Automated data-driven insights isolating portfolio concentration, runtime optimization windows, demographic coverage, and global market momentum.
        </p>
      </div>

      {/* Executive Summary Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-red-200 bg-gradient-to-br from-red-50/70 via-white to-slate-50 shadow-sm dark:border-red-900/40 dark:bg-gradient-to-br dark:from-red-950/20 dark:via-slate-900 dark:to-slate-950 dark:shadow-2xl relative overflow-hidden transition-colors duration-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 border border-red-200 dark:bg-red-600/20 dark:border-red-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-red-600 dark:text-red-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Executive Data Science Summary</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {insightsData.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Strategic Analysis Deep-Dives */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-red-600 dark:text-red-500" /> Core Strategic Findings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insightsData.insights.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/40 space-y-4 dark:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-colors duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                    {item.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">{item.title}</h3>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 whitespace-nowrap">
                  {item.key_metric}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Business Impact:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/30 font-semibold text-[11px]">
                    {item.impact}
                  </span>
                </div>
                {item.recommendation && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="text-red-600 dark:text-red-400 block mb-0.5 font-semibold">
                      Recommendation:
                    </strong>
                    {item.recommendation}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Intelligence Bullets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {/* Country Insights */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/40 space-y-3 transition-colors duration-200">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> Geographic Insights
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            {insightsData.country_insights.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-500 shrink-0 mt-0.5" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Genre Insights */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/40 space-y-3 transition-colors duration-200">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Film className="w-4 h-4 text-pink-600 dark:text-pink-400" /> Genre Intelligence
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            {insightsData.genre_insights.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-600 dark:text-pink-500 shrink-0 mt-0.5" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Rating Insights */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/40 space-y-3 transition-colors duration-200">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Ratings & Censorship
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            {insightsData.rating_insights.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Trend Insights */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/40 space-y-3 transition-colors duration-200">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Production Trends
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            {insightsData.trend_insights.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
