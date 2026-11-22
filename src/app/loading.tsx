import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-[#F7F6F1]">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="w-16 h-16 rounded-full border-4 border-[#E0DFD6] border-t-[#183C32] animate-spin" />
        <Loader2 className="w-6 h-6 text-[#D99A42] absolute animate-pulse" />
      </div>
      <h3 className="font-heading font-bold text-lg text-[#183C32] mt-6">
        Loading Rentora Marketplace
      </h3>
      <p className="text-xs text-[#6A726B] mt-1 max-w-xs text-center">
        Synchronizing machinery fleet listings and escrow transactions...
      </p>
    </div>
  );
}
