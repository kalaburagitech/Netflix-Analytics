"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  Database,
  ArrowRight,
  Sparkles,
  Info,
  Loader2,
  Table,
  RotateCcw,
  Trash2,
  AlertTriangle
} from "lucide-react";
import {
  fetchSchema,
  SchemaInfo,
  getTemplateDownloadUrl,
  uploadDataset,
  resetDataset,
  IngestResponse
} from "@/lib/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (res: IngestResponse) => void;
}

export function UploadDatasetModal({ isOpen, onClose, onSuccess }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"template" | "upload" | "reset">("upload");
  const [schema, setSchema] = useState<SchemaInfo | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [detectedHeaders, setDetectedHeaders] = useState<string[]>([]);
  const [isHeaderValid, setIsHeaderValid] = useState<boolean | null>(null);
  const [headerError, setHeaderError] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [ingestResult, setIngestResult] = useState<IngestResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchSchema().then((s) => setSchema(s));
      setIngestResult(null);
      setApiError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setHeaderError(null);
    setDetectedHeaders([]);
    setIsHeaderValid(null);

    const fn = file.name.toLowerCase();
    if (!fn.endsWith(".csv") && !fn.endsWith(".xlsx") && !fn.endsWith(".xls")) {
      setHeaderError("Unsupported file type. Please upload a .xlsx Excel or .csv file.");
      return;
    }

    // Client-side preflight inspection for CSV files
    if (fn.endsWith(".csv")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (!text) return;
        const firstLine = text.split(/\r\n|\n/)[0];
        const headers = firstLine
          .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
          .map((h) => h.replace(/^["']|["']$/g, "").trim().toLowerCase());

        setDetectedHeaders(headers);
        const hasTitle = headers.includes("title");
        if (hasTitle) {
          setIsHeaderValid(true);
        } else {
          setIsHeaderValid(false);
          setHeaderError("Heading Validation Notice: The required column 'title' was not found in the first row.");
        }
      };
      reader.readAsText(file.slice(0, 4096));
    } else {
      // For Excel files, server performs openpyxl schema validation
      setIsHeaderValid(true);
      setDetectedHeaders(["Excel format detected: Schema will be validated on ingestion"]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setHeaderError("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setApiError(null);

    try {
      const res = await uploadDataset(selectedFile);
      setIngestResult(res);
      if (onSuccess) onSuccess(res);
    } catch (err: any) {
      setApiError(err?.message || "Failed to process dataset upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleGoToDashboard = () => {
    onClose();
    router.push("/dashboard");
    router.refresh();
  };

  const handleGoToAnalytics = () => {
    onClose();
    router.push("/analytics");
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 dark:bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-slate-200 shadow-2xl dark:bg-slate-900 dark:border-slate-700 p-6 sm:p-8 overflow-hidden transition-all duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 dark:bg-red-600/20 dark:border-red-500/30 flex items-center justify-center">
              <Database className="w-5 h-5 text-red-600 dark:text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Ingest Dataset to Data Model
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload batch records via Excel or CSV with automated schema validation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        {!ingestResult && (
          <div className="flex flex-wrap items-center gap-2 pt-4 shrink-0">
            <button
              onClick={() => {
                setActiveTab("upload");
                setApiError(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "upload"
                  ? "bg-red-600 text-white shadow-md shadow-red-950/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>1. Upload & Ingest</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("template");
                setApiError(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "template"
                  ? "bg-red-600 text-white shadow-md shadow-red-950/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>2. View & Download Template</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("reset");
                setApiError(null);
                setResetSuccess(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "reset"
                  ? "bg-red-600 text-white shadow-md shadow-red-950/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>3. Reset & Delete Uploads</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 py-4 space-y-4">
          {/* SUCCESS SCREEN */}
          {ingestResult ? (
            <div className="py-6 space-y-6 text-center animate-fadeIn">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Ingestion Successful!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  {ingestResult.message}
                </p>
              </div>

              {/* Ingestion Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-left text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Records Ingested</span>
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                    +{ingestResult.records_ingested.toLocaleString()}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">New Total Catalog</span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                    {ingestResult.total_records.toLocaleString()}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Data Model Status</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Recalculated
                  </span>
                </div>
              </div>

              {/* Sample titles added */}
              {ingestResult.sample_titles && ingestResult.sample_titles.length > 0 && (
                <div className="max-w-lg mx-auto text-left p-3.5 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800 text-xs space-y-1.5">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Sample Titles Ingested:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {ingestResult.sample_titles.map((st, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium text-[11px]"
                      >
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={handleGoToDashboard}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all hover:scale-105"
                >
                  <span>View Updated KPI Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleGoToAnalytics}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all"
                >
                  <span>Launch Visual Analytics</span>
                </button>
              </div>
            </div>
          ) : activeTab === "upload" ? (
            /* UPLOAD & HEADING VALIDATION TAB */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Instructions banner */}
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-300 flex items-start gap-2.5">
                <Info className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">How to Ingest New Data:</p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    1. Fill your records in Excel or CSV using the standard template headings.<br />
                    2. Upload the file below. The system checks your headings automatically.<br />
                    3. Click <strong>&quot;Submit to Data Model&quot;</strong> to clean and ingest all records into the live analytics dashboard.
                  </p>
                </div>
              </div>

              {/* Error Banner */}
              {(apiError || headerError) && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 dark:bg-red-950/60 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                  <span>{apiError || headerError}</span>
                </div>
              )}

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  selectedFile
                    ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20"
                    : "border-slate-300 hover:border-red-500 bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950/50 dark:hover:bg-slate-900"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv, .xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />

                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center mx-auto">
                    {selectedFile ? (
                      <FileSpreadsheet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Upload className="w-6 h-6 text-red-600 dark:text-red-500" />
                    )}
                  </div>

                  <div>
                    {selectedFile ? (
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          {(selectedFile.size / 1024).toFixed(1)} KB • Click to change file
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          Click to browse or drag and drop your dataset
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Supports Microsoft Excel (.xlsx, .xls) and CSV (.csv) files
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Heading Validation Feedback Box */}
              {selectedFile && isHeaderValid !== null && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {isHeaderValid ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>Schema & Heading Match: Valid</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                          <span>Heading Mismatch Warning</span>
                        </>
                      )}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {detectedHeaders.length > 1
                        ? `${detectedHeaders.length} columns detected`
                        : "Ready to inspect"}
                    </span>
                  </div>

                  {/* Detected Column Badges */}
                  {detectedHeaders.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {detectedHeaders.map((col, idx) => {
                        const isMatch = [
                          "show_id", "type", "title", "director", "cast",
                          "country", "date_added", "release_year", "rating",
                          "duration", "listed_in", "description"
                        ].includes(col);

                        return (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              isMatch
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40"
                                : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                            }`}
                          >
                            {isMatch ? "✓ " : ""}{col}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Submit CTA */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab("template")}
                  className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Download Template First
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={uploading}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 text-xs font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !selectedFile}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all shadow-red-950/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Ingesting & Modeling Data...</span>
                      </>
                    ) : (
                      <>
                        <Database className="w-4 h-4" />
                        <span>Submit to Data Model</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : activeTab === "template" ? (
            /* TEMPLATE VIEW & DOWNLOAD TAB */
            <div className="space-y-5 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Official Netflix Ingestion Templates
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Formatted with standard headers and sample records
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={getTemplateDownloadUrl("excel")}
                    download="kalaburagitech_netflix_ingestion_template.xlsx"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Download Excel (.xlsx)</span>
                  </a>

                  <a
                    href={getTemplateDownloadUrl("csv")}
                    download="kalaburagitech_netflix_ingestion_template.csv"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 text-xs font-semibold shadow-sm transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download CSV (.csv)</span>
                  </a>
                </div>
              </div>

              {/* Schema Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">
                  Standard Heading Schema (12 Columns)
                </h4>
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto bg-white dark:bg-slate-950">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 font-semibold text-slate-700 dark:text-slate-300">
                        <th className="py-2.5 px-3">Column Header</th>
                        <th className="py-2.5 px-3">Requirement</th>
                        <th className="py-2.5 px-3">Description & Expected Format</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {schema?.columns.map((col) => (
                        <tr key={col.key} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40">
                          <td className="py-2.5 px-3 font-mono font-semibold text-red-600 dark:text-red-400">
                            {col.key}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                col.required
                                  ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/40"
                                  : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                              }`}
                            >
                              {col.required ? "Required" : "Optional"}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                            {col.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ready to upload CTA */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">
                  Filled out your file? Switch to the upload tab:
                </span>
                <button
                  onClick={() => setActiveTab("upload")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-all shadow-sm"
                >
                  <span>Go to Upload & Ingest</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* RESET & PURGE UPLOADS TAB */
            <div className="space-y-5 animate-fadeIn">
              {/* Warning Alert */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-amber-950 dark:text-amber-200">
                    Purge Uploaded Data & Reset Model
                  </h4>
                  <p className="leading-relaxed text-amber-900/90 dark:text-amber-300/90">
                    If you uploaded test batches or added custom titles and want to delete them, you can reset the entire database back to the authentic <strong>8,807 clean baseline records</strong>.
                  </p>
                </div>
              </div>

              {/* Status or Result Message */}
              {resetSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 dark:bg-emerald-950/50 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-900 dark:text-emerald-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span>{resetSuccess}</span>
                  </div>
                  <p>
                    All uploaded data and test additions have been purged. The dataset has been rebuilt to exactly 8,807 verified Netflix titles.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleGoToDashboard}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-sm"
                    >
                      Return to KPI Dashboard
                    </button>
                    <button
                      onClick={handleGoToAnalytics}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white dark:border-slate-700 font-semibold text-xs transition-all"
                    >
                      Inspect Visual Analytics
                    </button>
                  </div>
                </div>
              )}

              {apiError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 dark:bg-red-950/60 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                  <span>{apiError}</span>
                </div>
              )}

              {/* Comparison Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800 space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-red-500" />
                  <span>Baseline Data Model Specification</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 block text-[11px]">Clean Baseline Size</span>
                    <span className="text-lg font-extrabold text-slate-900 dark:text-white font-mono">
                      8,807 Titles
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 block text-[11px]">Movie / TV Split</span>
                    <span className="text-lg font-extrabold text-slate-900 dark:text-white font-mono">
                      69.6% / 30.4%
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 block text-[11px]">Ingestion Engine</span>
                    <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                      OpenPyXL & Pandas
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">
                  Ready to wipe all uploads and restart clean?
                </span>

                <button
                  type="button"
                  disabled={resetting}
                  onClick={async () => {
                    if (
                      !window.confirm(
                        "Are you sure you want to reset the dataset to the authentic 8,807 baseline records? All custom uploaded files and added titles will be permanently removed."
                      )
                    ) {
                      return;
                    }
                    setResetting(true);
                    setApiError(null);
                    setResetSuccess(null);
                    try {
                      const res = await resetDataset();
                      setResetSuccess(res.message);
                      if (onSuccess) {
                        onSuccess({
                          status: "success",
                          message: res.message,
                          records_ingested: 0,
                          total_records: res.total_records,
                          sample_titles: [],
                          matched_headers: []
                        });
                      }
                    } catch (err: any) {
                      setApiError(err?.message || "Failed to reset dataset.");
                    } finally {
                      setResetting(false);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all shadow-red-950/20 disabled:opacity-50"
                >
                  {resetting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Resetting & Re-modeling Data...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Reset Dataset to Baseline (8,807)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
