import Link from "next/link";
import { Film, ShieldCheck, Cpu, Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-100/70 text-slate-600 dark:border-slate-800/80 dark:bg-slate-950 dark:text-slate-400 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
              <Film className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white tracking-tight text-lg">
              Kalaburagi<span className="text-red-500">Tech</span> Netflix Analytics
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
            Enterprise exploratory data analytics, machine-readable dataset transformations, 
            and real-time streaming intelligence engineered by KalaburagiTech.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Local & Secure
            </span>
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" /> FastAPI Core Engine
            </span>
            <span className="flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" /> Next.js & TypeScript
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
            Platform Modules
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                Executive KPI Dashboard
              </Link>
            </li>
            <li>
              <Link href="/analytics" className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                Deep Visual Analytics
              </Link>
            </li>
            <li>
              <Link href="/explorer" className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                Catalog Data Explorer
              </Link>
            </li>
            <li>
              <Link href="/insights" className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                Strategic Insights Engine
              </Link>
            </li>
          </ul>
        </div>

        {/* Engineering & API */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
            Engineering & Specs
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="http://127.0.0.1:8000/docs"
                target="_blank"
                rel="noreferrer"
                className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1"
              >
                FastAPI Swagger Spec
              </a>
            </li>
            <li>
              <a
                href="http://127.0.0.1:8000/redoc"
                target="_blank"
                rel="noreferrer"
                className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                ReDoc Documentation
              </a>
            </li>
            <li>
              <span className="text-slate-500">Dataset: 8,807 Titles Validated</span>
            </li>
            <li>
              <span className="text-slate-500">Pipeline: Python 3.14 Cleaned</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>
          © {new Date().getFullYear()} KalaburagiTech. All rights reserved.
        </div>
        <div className="font-semibold text-slate-800 dark:text-slate-300">
          Built with ❤️ by KalaburagiTech
        </div>
      </div>
    </footer>
  );
}
