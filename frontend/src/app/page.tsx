import Link from "next/link";
import {
  Film,
  Tv,
  BarChart3,
  Globe,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Database,
  Layers,
  Award
} from "lucide-react";
import { fetchSummary } from "@/lib/api";

export default async function LandingPage() {
  const summary = await fetchSummary();

  const features = [
    {
      icon: BarChart3,
      title: "Exploratory Data Analysis",
      description: "Rigorous analytical pipeline processing 8,807 titles across 12 distinct catalog attributes.",
    },
    {
      icon: Globe,
      title: "Global Market Mapping",
      description: "In-depth geographic tracking spanning 122 producing countries with multi-national co-production analysis.",
    },
    {
      icon: TrendingUp,
      title: "Historical Trajectory",
      description: "Longitudinal release intelligence mapping nearly a century of cinema from 1925 to 2021.",
    },
    {
      icon: Layers,
      title: "Genre & Runtime Velocity",
      description: "Runtime histograms and cross-genre distributions isolating viewer completion sweet spots.",
    },
    {
      icon: Database,
      title: "Search & Export Engine",
      description: "Instant multi-attribute faceted queries with streaming CSV data export capabilities.",
    },
    {
      icon: Zap,
      title: "FastAPI & Next.js Architecture",
      description: "Asynchronous backend micro-services coupled with modern responsive frontend components.",
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-200 bg-red-50 text-red-600 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KALABURAGITECH ENTERPRISE ANALYTICS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Streaming Intelligence for <br />
            <span className="bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              Netflix Global Content
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            A comprehensive, portfolio-grade analytics platform dissecting 8,807 Netflix titles. 
            Engineered with FastAPI backend services and interactive Next.js visualizations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all shadow-lg shadow-red-950/20 hover:scale-105"
            >
              <span>Explore KPI Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/analytics"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700 font-semibold text-sm transition-all shadow-sm"
            >
              <BarChart3 className="w-4 h-4 text-red-600 dark:text-red-500" />
              <span>Deep Visual Analytics</span>
            </Link>

            <Link
              href="/explorer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 dark:text-slate-300 dark:border-slate-800 font-semibold text-sm transition-all"
            >
              <Database className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <span>Data Explorer</span>
            </Link>
          </div>
        </div>

        {/* Live Metrics Strip */}
        <div className="max-w-5xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-md transition-colors duration-200">
          <div className="text-center p-3">
            <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">Total Titles</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{summary.total_titles.toLocaleString()}</p>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">100% Verified</span>
          </div>

          <div className="text-center p-3 border-l border-slate-200 dark:border-slate-800">
            <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">Movies</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-red-600 dark:text-red-400 mt-1">{summary.total_movies.toLocaleString()}</p>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{summary.movies_percentage}% of Catalog</span>
          </div>

          <div className="text-center p-3 border-l border-slate-200 dark:border-slate-800">
            <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">TV Shows</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{summary.total_tv_shows.toLocaleString()}</p>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{summary.tv_shows_percentage}% of Catalog</span>
          </div>

          <div className="text-center p-3 border-l border-slate-200 dark:border-slate-800">
            <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">Countries</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{summary.total_countries}</p>
            <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-mono font-medium">Global Presence</span>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-red-600 dark:text-red-500">
            Architectural Excellence
          </h2>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            Designed for Data Scientists, Media Executives, & Decision Makers
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Transitioned from basic static exploratory notebooks into an enterprise-grade web application 
            with modular API endpoints, rich client-side interactivity, and zero external dependency risk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="group relative p-6 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900/80 transition-all duration-300 hover:border-red-300 dark:hover:border-slate-700 hover:translate-y-[-3px] shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 dark:bg-red-600/10 dark:border-red-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-red-600 dark:text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Analytics Preview Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-red-50/40 shadow-sm dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-red-950/30 dark:shadow-xl relative overflow-hidden transition-colors duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 dark:text-red-500 dark:bg-red-950/60 dark:border-red-900/50 px-3 py-1 rounded-full">
                Interactive Analytical Views
              </span>
              <h3 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                Turn Raw CSV Rows into High-Impact Strategic Intelligence
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Filter by maturity ratings, discover country-level content dominance, trace movie runtime distributions, 
                and uncover annual release trends using intuitive interactive charting.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/analytics"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md shadow-red-950/20"
                >
                  <span>Launch Visual Analytics</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/insights"
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 font-medium text-xs sm:text-sm transition-all shadow-sm"
                >
                  <span>Strategic Insights</span>
                </Link>
              </div>
            </div>

            {/* Visual Teaser Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm dark:bg-slate-950/80 dark:border-slate-800 space-y-2">
                <Film className="w-5 h-5 text-red-600 dark:text-red-500" />
                <p className="text-xs text-slate-500 dark:text-slate-400">Movie Avg Duration</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">99.6 min</p>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono">Sweet spot 90-110m</span>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm dark:bg-slate-950/80 dark:border-slate-800 space-y-2">
                <Globe className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                <p className="text-xs text-slate-500 dark:text-slate-400">Top Content Hub</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">United States</p>
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono">3,689 titles</span>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm dark:bg-slate-950/80 dark:border-slate-800 space-y-2">
                <Tv className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                <p className="text-xs text-slate-500 dark:text-slate-400">TV Season 1 Dominance</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">67.0%</p>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">1,793 shows</span>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm dark:bg-slate-950/80 dark:border-slate-800 space-y-2">
                <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <p className="text-xs text-slate-500 dark:text-slate-400">Dominant Maturity</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">TV-MA (36.4%)</p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Mature Skew</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About KalaburagiTech */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 dark:bg-red-600/10 dark:border-red-500/20 dark:text-red-500">
          <Film className="w-8 h-8" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          About KalaburagiTech
        </h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          KalaburagiTech is dedicated to building modern data-intensive platforms, advanced analytical engines, 
          and scalable web applications. This Netflix Analytics platform demonstrates our engineering principles: 
          rigorous statistical verification, responsive human-centric user experiences, and clean decoupled software architectures.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            <span>Start Exploring the Platform</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
