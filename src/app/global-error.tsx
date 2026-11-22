"use client";

import React, { useEffect } from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Rentora Global Root Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F7F6F1] flex items-center justify-center p-6 font-sans text-[#202824]">
        <div className="max-w-md w-full bg-white p-8 rounded-sm border border-[#E5E4DC] shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto">
            <AlertOctagon className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D99A42]">
              System Level Error
            </span>
            <h1 className="text-2xl font-extrabold text-[#183C32]">
              Rentora Service Interruption
            </h1>
            <p className="text-xs sm:text-sm text-[#6A726B] leading-relaxed">
              A critical runtime exception occurred. The platform has contained the error to safeguard your session.
            </p>
          </div>

          {error.digest && (
            <div className="p-2.5 bg-[#F7F6F1] border border-[#E5E4DC] rounded-xs text-[11px] font-mono text-[#8A948D]">
              Incident Hash: {error.digest}
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={() => reset()}
              className="w-full px-5 py-2.5 bg-[#183C32] hover:bg-[#245344] text-[#F7F6F1] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-xs inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-[#D99A42]" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
