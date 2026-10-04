"use client";

import { useState } from "react";
import { X, PlusCircle, Film, Tv, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { createTitle, TitleRecord } from "@/lib/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newTitle: TitleRecord) => void;
}

export function AddTitleModal({ isOpen, onClose, onSuccess }: Props) {
  const [type, setType] = useState<"Movie" | "TV Show">("Movie");
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [releaseYear, setReleaseYear] = useState(new Date().getFullYear());
  const [rating, setRating] = useState("TV-MA");
  const [duration, setDuration] = useState("95 min");
  const [country, setCountry] = useState("");
  const [genres, setGenres] = useState("");
  const [cast, setCast] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const created = await createTitle({
        type,
        title: title.trim(),
        director: director.trim(),
        cast: cast.trim(),
        country: country.trim() || "United States",
        release_year: Number(releaseYear),
        rating: rating.trim(),
        duration: duration.trim() || (type === "Movie" ? "90 min" : "1 Season"),
        listed_in: genres.trim() || "Dramas, International Movies",
        description: description.trim(),
      });

      onSuccess(created);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to add title. Please check connection to FastAPI backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl dark:bg-slate-900 dark:border-slate-700 p-6 overflow-hidden transition-colors duration-200">
        {/* Top header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 dark:bg-red-600/20 dark:border-red-500/30 flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-red-600 dark:text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add New Catalog Title</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Immediately updates the dataset and live analytical aggregations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 dark:bg-red-950/60 dark:border-red-800/80 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 my-4 text-xs">
          {/* Title & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Inception, Stranger Things"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-red-500 dark:bg-slate-950 dark:border-slate-700 dark:text-white dark:placeholder-slate-500 text-xs transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => {
                  const newType = e.target.value as "Movie" | "TV Show";
                  setType(newType);
                  if (newType === "Movie" && duration.includes("Season")) {
                    setDuration("95 min");
                  } else if (newType === "TV Show" && duration.includes("min")) {
                    setDuration("1 Season");
                  }
                }}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-red-500 dark:bg-slate-950 dark:border-slate-700 dark:text-white text-xs transition-colors"
              >
                <option value="Movie">Movie</option>
                <option value="TV Show">TV Show</option>
              </select>
            </div>
          </div>

          {/* Director & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Director</label>
              <input
                type="text"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                placeholder="e.g. Christopher Nolan"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-red-500 dark:bg-slate-950 dark:border-slate-700 dark:text-white dark:placeholder-slate-500 text-xs transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. United States, India, United Kingdom"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-red-500 dark:bg-slate-950 dark:border-slate-700 dark:text-white dark:placeholder-slate-500 text-xs transition-colors"
              />
            </div>
          </div>

          {/* Release Year, Rating & Duration */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Release Year</label>
              <input
                type="number"
                min="1920"
                max="2030"
                value={releaseYear}
                onChange={(e) => setReleaseYear(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-red-500 dark:bg-slate-950 dark:border-slate-700 dark:text-white text-xs transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-red-500 dark:bg-slate-950 dark:border-slate-700 dark:text-white text-xs transition-colors"
              >
                <option value="TV-MA">TV-MA</option>
                <option value="TV-14">TV-14</option>
                <option value="TV-PG">TV-PG</option>
                <option value="R">R</option>
                <option value="PG-13">PG-13</option>
                <option value="TV-Y7">TV-Y7</option>
                <option value="TV-Y">TV-Y</option>
                <option value="PG">PG</option>
                <option value="TV-G">TV-G</option>
                <option value="G">G</option>
                <option value="NR">NR</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder={type === "Movie" ? "e.g. 102 min" : "e.g. 2 Seasons"}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-red-500 dark:bg-slate-950 dark:border-slate-700 dark:text-white dark:placeholder-slate-500 text-xs transition-colors"
              />
            </div>
          </div>

          {/* Genres */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Genres (comma separated)</label>
            <input
              type="text"
              value={genres}
              onChange={(e) => setGenres(e.target.value)}
              placeholder="e.g. Action & Adventure, Sci-Fi, Dramas"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-red-500 dark:bg-slate-950 dark:border-slate-700 dark:text-white dark:placeholder-slate-500 text-xs transition-colors"
            />
          </div>

          {/* Cast */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Cast Members (optional)</label>
            <input
              type="text"
              value={cast}
              onChange={(e) => setCast(e.target.value)}
              placeholder="e.g. Leonardo DiCaprio, Joseph Gordon-Levitt"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-red-500 dark:bg-slate-950 dark:border-slate-700 dark:text-white dark:placeholder-slate-500 text-xs transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Synopsis / Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the storyline or premise..."
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-red-500 dark:bg-slate-950 dark:border-slate-700 dark:text-white dark:placeholder-slate-500 text-xs resize-none transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all shadow-md shadow-red-950/20 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? "Saving to Dataset..." : "Save to Dataset"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
