import {
  fetchSummary,
  fetchMoviesStats,
  fetchTVShowsStats,
  fetchCountries,
  fetchGenres,
  fetchRatings,
  fetchTrends,
} from "@/lib/api";
import { MoviesVsTvChart } from "@/components/Charts/MoviesVsTvChart";
import { TrendsChart } from "@/components/Charts/TrendsChart";
import { RatingsChart } from "@/components/Charts/RatingsChart";
import { TopCountriesChart } from "@/components/Charts/TopCountriesChart";
import { GenreChart } from "@/components/Charts/GenreChart";
import { DurationHistogram } from "@/components/Charts/DurationHistogram";
import { UploadDatasetButton } from "@/components/UploadDatasetButton";
import {
  BarChart3,
  Clock,
  Globe,
  Film,
  Tv,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export default async function AnalyticsPage() {
  const [
    summary,
    movieStats,
    tvStats,
    countries,
    genres,
    ratings,
    trends,
  ] = await Promise.all([
    fetchSummary(),
    fetchMoviesStats(),
    fetchTVShowsStats(),
    fetchCountries(12),
    fetchGenres(12),
    fetchRatings(),
    fetchTrends(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6 transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-900/40 uppercase tracking-wider">
              Interactive Visualizations
            </span>
            <span className="text-xs text-slate-500">6 Modular Statistical Views</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Deep Visual Analytics & Exploratory Data Science
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Visualizing content types, duration distributions, demographic ratings, regional hubs, and longitudinal production trajectory.
          </p>
        </div>

        <div className="shrink-0">
          <UploadDatasetButton variant="primary" label="Upload Dataset (Excel/CSV)" />
        </div>
      </div>

      {/* Row 1: Content Ratio & Historical Release Trajectory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-xl lg:col-span-1 transition-colors duration-200">
          <MoviesVsTvChart
            moviesCount={summary.total_movies}
            tvShowsCount={summary.total_tv_shows}
          />
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-xl lg:col-span-2 transition-colors duration-200">
          <TrendsChart trends={trends} />
        </div>
      </div>

      {/* Row 2: Top Countries & Genre Portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-xl transition-colors duration-200">
          <TopCountriesChart countries={countries} />
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-xl transition-colors duration-200">
          <GenreChart genres={genres} />
        </div>
      </div>

      {/* Row 3: Movie Duration Distribution & Content Ratings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-xl transition-colors duration-200">
          <DurationHistogram
            bins={movieStats.duration_distribution}
            avgDuration={movieStats.avg_duration_minutes}
            medianDuration={movieStats.median_duration_minutes}
          />
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-xl transition-colors duration-200">
          <RatingsChart ratings={ratings} />
        </div>
      </div>

      {/* TV Shows Season Breakdown & Yearly Growth Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TV Seasons Breakdown */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-xl space-y-4 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Tv className="w-4 h-4 text-amber-500" /> TV Shows Season Count
            </h4>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-mono font-medium">
              {tvStats.total_tv_shows} Shows
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Serialized television duration patterns across seasons
          </p>

          <div className="space-y-2.5 pt-2">
            {tvStats.season_distribution.map((item, idx) => {
              const pct = ((item.count / tvStats.total_tv_shows) * 100).toFixed(1);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{item.seasons}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono">
                      {item.count.toLocaleString()} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-500 h-1.5 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Movie Directors */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-xl space-y-4 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Film className="w-4 h-4 text-red-500" /> Prolific Movie Directors
            </h4>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Ranked by titles</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Filmmakers with highest volume of credited features
          </p>

          <div className="space-y-2.5 pt-2">
            {movieStats.top_directors.slice(0, 5).map((dir, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800/80 text-xs"
              >
                <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[200px]" title={dir.director}>
                  {idx + 1}. {dir.director}
                </span>
                <span className="font-mono text-red-600 dark:text-red-400 font-semibold px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/40">
                  {dir.count} movies
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Yearly Additions Velocity */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-xl space-y-4 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Yearly Growth Milestones
            </h4>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">Historical Record</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Significant epochs in Netflix platform scaling
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-800 dark:text-slate-200 font-semibold">2018 Peak Production</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">1,147 Titles</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                The highest single-year release volume in the entire dataset.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-800 dark:text-slate-200 font-semibold">2016 Global Rollout</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">902 Titles</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Rapid catalog diversification across European and Asian production hubs.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-800 dark:text-slate-200 font-semibold">Episodic Pivot (2019-2021)</span>
                <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">400+ TV Shows/yr</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Strategic transition towards high-retention serialized content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
