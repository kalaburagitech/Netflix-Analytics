"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  Download,
  Film,
  Tv,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  SlidersHorizontal,
  Eye,
  Calendar,
  Globe,
  PlusCircle,
  Sparkles,
  FileSpreadsheet,
  Trash2
} from "lucide-react";
import { searchTitles, TitleRecord, getExportUrl, deleteTitle } from "@/lib/api";
import { TitleDetailModal } from "@/components/TitleDetailModal";
import { AddTitleModal } from "@/components/AddTitleModal";
import { UploadDatasetModal } from "@/components/UploadDatasetModal";

export default function ExplorerPage() {
  const [query, setQuery] = useState("");
  const [contentType, setContentType] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [sortBy, setSortBy] = useState("release_year");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const [page, setPage] = useState(1);
  const pageSize = 15;

  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [titles, setTitles] = useState<TitleRecord[]>([]);
  const [availableFilters, setAvailableFilters] = useState<{
    countries: string[];
    genres: string[];
    ratings: string[];
    types: string[];
  }>({
    countries: [],
    genres: [],
    ratings: [],
    types: ["Movie", "TV Show"],
  });

  const [selectedTitle, setSelectedTitle] = useState<TitleRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await searchTitles({
        query: query.trim() || undefined,
        type: contentType,
        country: selectedCountry,
        genre: selectedGenre,
        rating: selectedRating,
        page,
        pageSize,
        sortBy,
        sortOrder,
      });

      setTitles(res.items);
      setTotalRecords(res.total);
      setTotalPages(res.total_pages);
      if (res.available_filters?.countries?.length) {
        setAvailableFilters(res.available_filters);
      }
    } catch (e) {
      console.error("Failed to load catalog data:", e);
    } finally {
      setLoading(false);
    }
  }, [query, contentType, selectedCountry, selectedGenre, selectedRating, page, sortBy, sortOrder]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleResetFilters = () => {
    setQuery("");
    setContentType("all");
    setSelectedCountry("all");
    setSelectedGenre("all");
    setSelectedRating("all");
    setSortBy("release_year");
    setSortOrder("desc");
    setPage(1);
  };

  const exportUrl = getExportUrl({
    query: query.trim() || undefined,
    type: contentType,
    country: selectedCountry,
    genre: selectedGenre,
    rating: selectedRating,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6 transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-900/40 uppercase tracking-wider">
              Data Explorer
            </span>
            <span className="text-xs text-slate-500">Live Multi-Attribute Filtering</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Netflix Titles Catalog Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Search, filter, sort, inspect metadata, upload Excel/CSV batches, and export subsets of catalog items.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-red-950/20 hover:scale-105"
            title="Upload dataset in Excel (.xlsx) or CSV (.csv) format"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Upload Dataset (Excel/CSV)</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Single Title</span>
          </button>

          <a
            href={exportUrl}
            download
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{successBanner}</span>
          </div>
          <button
            onClick={() => setSuccessBanner(null)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter Controls Panel */}
      <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 backdrop-blur-md space-y-4 transition-colors duration-200">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title, director, cast members, or synopsis keywords..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 dark:bg-slate-950 dark:border-slate-700/80 dark:text-white dark:placeholder-slate-500 text-sm focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Content Type */}
          <div>
            <label className="block text-slate-700 dark:text-slate-400 mb-1 font-medium">Type</label>
            <select
              value={contentType}
              onChange={(e) => {
                setContentType(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-200 focus:outline-none focus:border-red-500"
            >
              <option value="all">All Types</option>
              <option value="Movie">Movie</option>
              <option value="TV Show">TV Show</option>
            </select>
          </div>

          {/* Country */}
          <div>
            <label className="block text-slate-700 dark:text-slate-400 mb-1 font-medium">Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-200 focus:outline-none focus:border-red-500"
            >
              <option value="all">All Countries</option>
              {availableFilters.countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Genre */}
          <div>
            <label className="block text-slate-700 dark:text-slate-400 mb-1 font-medium">Genre</label>
            <select
              value={selectedGenre}
              onChange={(e) => {
                setSelectedGenre(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-200 focus:outline-none focus:border-red-500"
            >
              <option value="all">All Genres</option>
              {availableFilters.genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-slate-700 dark:text-slate-400 mb-1 font-medium">Rating</label>
            <select
              value={selectedRating}
              onChange={(e) => {
                setSelectedRating(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-200 focus:outline-none focus:border-red-500"
            >
              <option value="all">All Ratings</option>
              {availableFilters.ratings.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-slate-700 dark:text-slate-400 mb-1 font-medium">Sort Field</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-200 focus:outline-none focus:border-red-500"
            >
              <option value="release_year">Release Year</option>
              <option value="title">Title</option>
              <option value="type">Type</option>
            </select>
          </div>

          {/* Sort Order & Reset */}
          <div className="flex items-end gap-2">
            <button
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
              className="flex-1 py-2 px-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 hover:border-slate-400 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 font-medium"
              title="Toggle sort direction"
            >
              {sortOrder === "desc" ? "Desc (↓)" : "Asc (↑)"}
            </button>
            <button
              onClick={handleResetFilters}
              className="p-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-600 hover:text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white"
              title="Reset all filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Meta */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Showing{" "}
          <strong className="text-slate-900 dark:text-white font-mono font-semibold">
            {totalRecords > 0 ? (page - 1) * pageSize + 1 : 0}
          </strong>{" "}
          to{" "}
          <strong className="text-slate-900 dark:text-white font-mono font-semibold">
            {Math.min(page * pageSize, totalRecords)}
          </strong>{" "}
          of <strong className="text-slate-900 dark:text-white font-mono font-semibold">{totalRecords.toLocaleString()}</strong> titles
        </span>
        <span>
          Page {page} of {totalPages}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-xl transition-colors duration-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Release</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Country</th>
              <th className="py-3 px-4">Genres</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
                    <span>Executing query...</span>
                  </div>
                </td>
              </tr>
            ) : titles.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  No catalog items found matching the selected criteria.
                </td>
              </tr>
            ) : (
              titles.map((item) => (
                <tr
                  key={item.show_id}
                  onClick={() => setSelectedTitle(item)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      {item.title}
                    </div>
                    {item.director && (
                      <span className="text-[11px] text-slate-500 block truncate max-w-[200px]">
                        Dir: {item.director}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        item.type === "Movie"
                          ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/40"
                          : "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40"
                      }`}
                    >
                      {item.type === "Movie" ? (
                        <Film className="w-3 h-3" />
                      ) : (
                        <Tv className="w-3 h-3" />
                      )}
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">{item.release_year}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 text-[10px] font-mono">
                      {item.rating || "N/A"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap font-mono">
                    {item.duration || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-[140px] truncate" title={item.country}>
                    {item.country || "Unknown"}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-[200px] truncate" title={item.listed_in}>
                    {item.listed_in}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTitle(item);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Inspect full details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (window.confirm(`Are you sure you want to delete "${item.title}" (${item.show_id}) from the catalog?`)) {
                            try {
                              await deleteTitle(item.show_id);
                              setSuccessBanner(`Deleted "${item.title}" (${item.show_id}) from the dataset.`);
                              loadData();
                            } catch (err: any) {
                              alert(err?.message || "Failed to delete title");
                            }
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="Delete this title from catalog"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1 || loading}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <span className="text-xs text-slate-500 dark:text-slate-400">
          Page <strong className="text-slate-900 dark:text-white font-mono font-semibold">{page}</strong> of{" "}
          <strong className="text-slate-900 dark:text-white font-mono font-semibold">{totalPages}</strong>
        </span>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages || loading}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Detail Modal */}
      <TitleDetailModal
        title={selectedTitle}
        onClose={() => setSelectedTitle(null)}
        onDelete={(deletedId) => {
          setSuccessBanner(`Successfully deleted title (${deletedId}) from the dataset.`);
          loadData();
        }}
      />

      {/* Add New Title Modal */}
      <AddTitleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(newTitle) => {
          setSuccessBanner(`Successfully added "${newTitle.title}" (ID: ${newTitle.show_id}) to the Netflix catalog!`);
          loadData();
        }}
      />

      {/* Upload Dataset (Excel/CSV) Modal */}
      <UploadDatasetModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={(res) => {
          setSuccessBanner(res.message);
          loadData();
        }}
      />
    </div>
  );
}
