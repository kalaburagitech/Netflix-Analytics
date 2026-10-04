import Link from "next/link";
import {
  Film,
  Tv,
  Globe,
  UserCheck,
  Tag,
  ShieldAlert,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Activity,
  Database
} from "lucide-react";
import {
  fetchSummary,
  fetchCountries,
  fetchRatings,
  fetchGenres,
  fetchMoviesStats
} from "@/lib/api";
import { StatCard } from "@/components/StatCard";
import { MoviesVsTvChart } from "@/components/Charts/MoviesVsTvChart";
import { RatingsChart } from "@/components/Charts/RatingsChart";
import { UploadDatasetButton } from "@/components/UploadDatasetButton";

export default async function DashboardPage() {
  const [summary, countries, ratings, genres, movieStats] = await Promise.all([
    fetchSummary(),
    fetchCountries(5),
    fetchRatings(),
    fetchGenres(5),
    fetchMoviesStats(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6 transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-900/40 uppercase tracking-wider">
              Executive View
            </span>
            <span className="text-xs text-slate-500">Live Analytics Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            KalaburagiTech Executive KPI Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Real-time catalog metrics and high-level distributions across {summary.total_titles.toLocaleString()} records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <UploadDatasetButton variant="primary" label="Upload Dataset (Excel/CSV)" />

          <Link
            href="/analytics"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            <Activity className="w-4 h-4 text-red-600 dark:text-red-500" />
            <span>Deep Visualizations</span>
          </Link>

          <Link
            href="/explorer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            <Database className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            <span>Browse Catalog</span>
          </Link>
        </div>
      </div>

      {/* 8 Primary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Titles"
          value={summary.total_titles}
          subtitle="Complete catalog entries"
          icon={Layers}
          badge="100% Ingested"
        />

        <StatCard
          title="Movies"
          value={summary.total_movies}
          subtitle={`${summary.movies_percentage}% of total catalog`}
          icon={Film}
          badge="Feature Films"
          badgeColor="text-red-400 bg-red-950/60 border-red-800/40"
        />

        <StatCard
          title="TV Shows"
          value={summary.total_tv_shows}
          subtitle={`${summary.tv_shows_percentage}% of total catalog`}
          icon={Tv}
          badge="Serialized"
          badgeColor="text-amber-400 bg-amber-950/60 border-amber-800/40"
        />

        <StatCard
          title="Countries"
          value={summary.total_countries}
          subtitle="Worldwide production hubs"
          icon={Globe}
          badge="Global"
          badgeColor="text-cyan-400 bg-cyan-950/60 border-cyan-800/40"
        />

        <StatCard
          title="Directors"
          value={summary.total_directors}
          subtitle="Identified creators"
          icon={UserCheck}
          badge="Talent Pool"
          badgeColor="text-purple-400 bg-purple-950/60 border-purple-800/40"
        />

        <StatCard
          title="Distinct Genres"
          value={summary.total_genres}
          subtitle="Categories & classifications"
          icon={Tag}
          badge="Taxonomy"
          badgeColor="text-pink-400 bg-pink-950/60 border-pink-800/40"
        />

        <StatCard
          title="Ratings Groups"
          value={summary.total_ratings}
          subtitle="Censorship & age classifications"
          icon={ShieldAlert}
          badge="Compliance"
          badgeColor="text-emerald-400 bg-emerald-950/60 border-emerald-800/40"
        />

        <StatCard
          title="Release Timeline"
          value={`${summary.min_release_year} – ${summary.max_release_year}`}
          subtitle="Historical release period"
          icon={Calendar}
          badge="96 Years Span"
          badgeColor="text-indigo-400 bg-indigo-950/60 border-indigo-800/40"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-xl transition-colors duration-200">
          <MoviesVsTvChart
            moviesCount={summary.total_movies}
            tvShowsCount={summary.total_tv_shows}
          />
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-xl transition-colors duration-200">
          <RatingsChart ratings={ratings} />
        </div>
      </div>

      {/* Secondary Intelligence Breakdown Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Countries Preview */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 space-y-4 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-cyan-500 dark:text-cyan-400" /> Top Content Hubs
            </h4>
            <Link href="/analytics" className="text-[11px] text-red-600 dark:text-red-400 font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {countries.map((c, i) => (
              <div key={c.country} className="flex items-center justify-between text-xs">
                <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <span className="font-mono text-slate-400 dark:text-slate-500 w-4">{i + 1}.</span>
                  {c.country}
                </span>
                <span className="font-mono text-slate-900 dark:text-white font-semibold">
                  {c.total_shows.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">({c.percentage_of_total}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Genres Preview */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 space-y-4 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-pink-500 dark:text-pink-400" /> Leading Genres
            </h4>
            <Link href="/analytics" className="text-[11px] text-red-600 dark:text-red-400 font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {genres.map((g, i) => (
              <div key={g.genre} className="flex items-center justify-between text-xs">
                <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2 truncate max-w-[170px]" title={g.genre}>
                  <span className="font-mono text-slate-400 dark:text-slate-500 w-4">{i + 1}.</span>
                  {g.genre}
                </span>
                <span className="font-mono text-slate-900 dark:text-white font-semibold">
                  {g.total_count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Runtime & Catalog Insights Snapshot */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 space-y-4 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Strategic Highlights
            </h4>
            <Link href="/insights" className="text-[11px] text-red-600 dark:text-red-400 font-medium hover:underline">
              Read Report
            </Link>
          </div>
          <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800/80">
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium block">Average Movie Length</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {movieStats.avg_duration_minutes} minutes
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Median is {movieStats.median_duration_minutes} min</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800/80">
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium block">Catalog Expansion Peak</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">2017 – 2019</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Highest volume of historical additions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
