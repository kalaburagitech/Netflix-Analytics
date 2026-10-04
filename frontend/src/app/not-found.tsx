import Link from "next/link";
import { Film } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center">
        <Film className="w-6 h-6 text-red-500" />
      </div>
      <h1 className="text-4xl font-extrabold text-white">404 - Page Not Found</h1>
      <p className="text-slate-400 text-sm max-w-md">
        The requested catalog route does not exist. Explore the dashboard or search through the Netflix titles.
      </p>
      <Link
        href="/dashboard"
        className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
