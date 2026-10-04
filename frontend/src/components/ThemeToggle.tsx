"use client";

import { useTheme } from "./ThemeContext";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="p-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-100 text-slate-700 dark:border-slate-800 dark:hover:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 transition-all shadow-sm"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-600" />
      )}
    </button>
  );
}
