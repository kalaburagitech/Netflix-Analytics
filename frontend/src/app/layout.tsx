import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeContext";

export const metadata: Metadata = {
  title: "KalaburagiTech Netflix Analytics Platform",
  description: "Advanced Netflix Data Analytics Dashboard built by KalaburagiTech",
  keywords: [
    "KalaburagiTech",
    "Netflix Analytics",
    "Data Science",
    "EDA",
    "FastAPI",
    "Next.js",
    "Streaming Analytics"
  ],
  authors: [{ name: "KalaburagiTech" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#08090D] dark:text-slate-100 transition-colors duration-200 flex flex-col antialiased selection:bg-red-500 selection:text-white">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
