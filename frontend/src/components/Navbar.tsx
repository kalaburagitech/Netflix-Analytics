"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Film,
  BarChart3,
  Compass,
  Lightbulb,
  Database,
  Menu,
  X,
  ExternalLink,
  Activity,
  Upload
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { UploadDatasetModal } from "./UploadDatasetModal";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    // Check backend health
    fetch("http://127.0.0.1:8000/api/health")
      .then((res) => {
        if (res.ok) setApiOnline(true);
        else setApiOnline(false);
      })
      .catch(() => setApiOnline(false));
  }, []);

  const navLinks = [
    { name: "Overview", href: "/" },
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Analytics", href: "/analytics", icon: Activity },
    { name: "Data Explorer", href: "/explorer", icon: Database },
    { name: "Insights", href: "/insights", icon: Lightbulb },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 dark:border-slate-800/80 dark:bg-[#08090D]/90 backdrop-blur-md transition-colors duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-950/30 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Kalaburagi<span className="text-red-500">Tech</span>
              </span>
              <span className="text-[11px] block -mt-1 font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                Netflix Analytics
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Tools */}
          <div className="hidden md:flex items-center gap-3">
            {/* Backend Status Badge */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                apiOnline
                  ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/40"
                  : "bg-amber-950/40 text-amber-400 border-amber-800/40"
              }`}
              title={apiOnline ? "FastAPI Backend is online" : "Using in-memory cached analysis engine"}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  apiOnline ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
              {apiOnline ? "API Live" : "Engine Standby"}
            </div>

            <button
              onClick={() => setUploadModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-all hover:scale-105"
              title="Upload Excel or CSV dataset with automated heading validation"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Dataset</span>
            </button>

            <a
              href="http://127.0.0.1:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 hover:underline transition-colors"
            >
              API Docs <ExternalLink className="w-3 h-3" />
            </a>

            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setUploadModalOpen(true)}
              className="p-2 rounded-xl bg-red-600 text-white text-xs font-semibold"
              title="Upload Dataset"
            >
              <Upload className="w-4 h-4" />
            </button>
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 px-4 pt-2 pb-6 space-y-2 shadow-lg transition-colors duration-200">
          <button
            onClick={() => {
              setMobileOpen(false);
              setUploadModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-xs"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Dataset (Excel / CSV)</span>
          </button>
          {navLinks.map((link) => {
            const active = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-red-50 text-red-600 font-semibold dark:bg-red-500/20 dark:text-red-400"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-3">
            <span>FastAPI: {apiOnline ? "Connected" : "Standby"}</span>
            <a
              href="http://127.0.0.1:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="text-red-600 dark:text-red-400 font-medium flex items-center gap-1 hover:underline"
            >
              Swagger Docs <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Dataset Ingestion Modal */}
      <UploadDatasetModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </header>
  );
}
