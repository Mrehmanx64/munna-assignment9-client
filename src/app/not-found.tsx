import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { Wrench, ArrowRight, Home, PackageSearch } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F1]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-lg w-full text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xs bg-[#EBEAE3] border border-[#DCDBCF] text-xs font-bold uppercase tracking-widest text-[#183C32]">
            <Wrench className="w-3.5 h-3.5 text-[#D99A42]" />
            <span>404 Field Error</span>
          </div>

          <div className="space-y-2">
            <h1 className="font-heading text-5xl sm:text-6xl font-extrabold text-[#183C32] tracking-tight">
              404
            </h1>
            <h2 className="font-heading text-2xl font-bold text-[#202824]">
              Machinery Listing Not Located
            </h2>
            <p className="text-xs sm:text-sm text-[#6A726B] leading-relaxed max-w-sm mx-auto">
              The equipment record or route you requested has been demobilized, relocated, or does not exist in our active fleet database.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#DCDBCF] hover:bg-[#EBEAE3] text-[#183C32] text-xs font-semibold rounded-xs transition-colors shadow-2xs inline-flex items-center justify-center gap-2"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return Home</span>
            </Link>

            <Link
              href="/equipment"
              className="w-full sm:w-auto px-5 py-2.5 bg-[#183C32] hover:bg-[#245344] text-[#F7F6F1] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-xs inline-flex items-center justify-center gap-2"
            >
              <PackageSearch className="w-3.5 h-3.5 text-[#D99A42]" />
              <span>Browse All Equipment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
