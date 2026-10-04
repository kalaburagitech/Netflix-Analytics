"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileSpreadsheet } from "lucide-react";
import { UploadDatasetModal } from "./UploadDatasetModal";

interface Props {
  className?: string;
  variant?: "primary" | "outline" | "banner";
  label?: string;
}

export function UploadDatasetButton({
  className = "",
  variant = "primary",
  label = "Upload Dataset (Excel/CSV)"
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  let btnClasses = "";
  if (variant === "primary") {
    btnClasses = "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-red-950/20 hover:scale-105";
  } else if (variant === "outline") {
    btnClasses = "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-sm";
  } else if (variant === "banner") {
    btnClasses = "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-emerald-950/20 hover:scale-105";
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`${btnClasses} ${className}`}
        title="Upload an Excel or CSV file to model new data and update analytics"
      >
        <FileSpreadsheet className="w-4 h-4" />
        <span>{label}</span>
      </button>

      <UploadDatasetModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </>
  );
}
