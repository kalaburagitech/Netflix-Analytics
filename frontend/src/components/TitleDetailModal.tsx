"use client";

import { useState } from "react";
import { X, Film, Tv, Calendar, Globe, Clock, Tag, User, Users, Trash2, Loader2, AlertCircle } from "lucide-react";
import { TitleRecord, deleteTitle } from "@/lib/api";

interface Props {
  title: TitleRecord | null;
  onClose: () => void;
  onDelete?: (showId: string) => void;
}

export function TitleDetailModal({ title, onClose, onDelete }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!title) return null;

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title.title}" (Catalog ID: ${title.show_id}) from the dataset?`)) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteTitle(title.show_id);
      if (onDelete) onDelete(title.show_id);
      onClose();
    } catch (err: any) {
      setDeleteError(err?.message || "Failed to delete title.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl dark:bg-slate-900 dark:border-slate-700 p-6 overflow-hidden transition-colors duration-200">
        {/* Top bar */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 dark:bg-red-600/20 dark:border-red-500/30 flex items-center justify-center">
              {title.type === "Movie" ? (
                <Film className="w-5 h-5 text-red-600 dark:text-red-500" />
              ) : (
                <Tv className="w-5 h-5 text-amber-600 dark:text-amber-500" />
              )}
            </div>
            <div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 uppercase tracking-wide">
                {title.type} • {title.rating || "Unrated"}
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{title.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification if delete failed */}
        {deleteError && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 dark:bg-red-950/60 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{deleteError}</span>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800/40 dark:border-slate-700/50">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> Release Year
            </span>
            <span className="text-base font-semibold text-slate-900 dark:text-white">{title.release_year}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800/40 dark:border-slate-700/50">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> Duration
            </span>
            <span className="text-base font-semibold text-slate-900 dark:text-white">{title.duration || "N/A"}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800/40 dark:border-slate-700/50 col-span-2">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
              <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> Origin Country
            </span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white truncate block">
              {title.country || "Unknown Country"}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3 text-xs">
          <div>
            <h4 className="text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-1">
              Synopsis
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800/80">
              {title.description || "No synopsis available."}
            </p>
          </div>

          {/* Genres */}
          <div>
            <h4 className="text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Genres & Categorization
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {title.listed_in.split(",").map((g, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/30 dark:border-red-900/40 dark:text-red-300 text-[11px] font-medium"
                >
                  {g.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Director & Cast */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1 font-medium">
                <User className="w-3.5 h-3.5" /> Director
              </span>
              <p className="text-slate-900 dark:text-slate-200 font-semibold">{title.director || "Unknown"}</p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1 font-medium">
                <Users className="w-3.5 h-3.5" /> Key Cast
              </span>
              <p className="text-slate-700 dark:text-slate-300 truncate" title={title.cast}>
                {title.cast || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer with Catalog ID & Delete Action */}
        <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div>
            <span>Catalog ID: <strong>{title.show_id}</strong></span>
            <span className="ml-3">Added: {title.date_added || "Historical"}</span>
          </div>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/50 border border-red-200 dark:border-red-900/50 font-medium transition-colors disabled:opacity-50"
            title="Permanently remove this title from the catalog"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Title</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
