"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log sanitized error client-side
    console.error("Rentora Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 bg-[#F7F6F1]">
      <div className="max-w-md w-full bg-white p-8 rounded-sm border border-[#E5E4DC] shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-[#D99A42] flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D99A42]">
            Application Notice
          </span>
          <h1 className="font-heading text-2xl font-extrabold text-[#183C32]">
            Something went wrong
          </h1>
          <p className="text-xs sm:text-sm text-[#6A726B] leading-relaxed">
            An unexpected error occurred while rendering this view. Our system has safely isolated the incident.
          </p>
        </div>

        {error.digest && (
          <div className="p-2.5 bg-[#F7F6F1] border border-[#E5E4DC] rounded-xs text-[11px] font-mono text-[#8A948D]">
            Error Reference: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#183C32] hover:bg-[#245344] text-[#F7F6F1] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-xs inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-[#D99A42]" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-[#EBEAE3] text-[#183C32] border border-[#DCDBCF] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors inline-flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
