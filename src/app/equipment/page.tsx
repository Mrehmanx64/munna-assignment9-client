"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  SlidersHorizontal,
  ArrowUpDown,
  PackageOpen,
  X,
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { EquipmentCard } from "@/components/equipment/EquipmentCard";
import { EquipmentFilters } from "@/components/equipment/EquipmentFilters";
import { useEquipmentFilter } from "@/hooks/useEquipmentFilter";
import { useApp } from "@/context/AppContext";
import { Equipment } from "@/types";

function EquipmentCatalogContent() {
  const searchParams = useSearchParams();
  const { equipmentList } = useApp();
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All";
  const initialLocation = searchParams.get("location") || "";

  const {
    criteria,
    updateCriteria,
    resetCriteria,
    filteredEquipment,
    activeFiltersCount,
    isLoading,
  } = useEquipmentFilter(equipmentList, {
    search: initialSearch,
    category: initialCategory,
    location: initialLocation,
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F1]">
      <Navbar />

      <main className="flex-1">
        {/* Editorial Page Header & Breadcrumbs */}
        <div className="bg-[#EBEAE3] border-b border-[#DCDBCF] py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1.5 text-xs text-[#6A726B] mb-3">
              <Link href="/" className="hover:text-[#183C32]">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#183C32] font-semibold">Equipment Catalog</span>
              {criteria.category !== "All" && (
                <>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-[#183C32]">{criteria.category}</span>
                </>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#183C32] tracking-tight">
                  Industrial Equipment Discovery
                </h1>
                <p className="text-sm text-[#555E57] mt-1 max-w-2xl">
                  Explore verified heavy machinery, aerial platforms, cinema camera packages, and mobile power gear with transparent daily and weekly rates.
                </p>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-4 py-2 bg-white border border-[#DCDBCF] rounded-xs text-xs font-bold uppercase tracking-wider text-[#183C32] flex items-center justify-center gap-2 shadow-2xs self-start"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#D99A42]" />
                <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Catalog Main Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block lg:col-span-3">
              <EquipmentFilters
                criteria={criteria}
                updateCriteria={updateCriteria}
                resetCriteria={resetCriteria}
                allEquipment={equipmentList}
              />
            </aside>

            {/* Results Grid */}
            <div className="lg:col-span-9 space-y-6">
              {/* Controls Bar */}
              <div className="bg-white p-3.5 sm:p-4 rounded-sm border border-[#E5E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="text-xs text-[#6A726B]">
                  Showing <span className="font-bold text-[#183C32]">{filteredEquipment.length}</span> verified equipment listings
                  {criteria.category !== "All" && (
                    <span className="font-medium text-[#D99A42]"> in {criteria.category}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <label htmlFor="sort-by-select" className="text-xs font-semibold text-[#6A726B] flex items-center gap-1">
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#183C32]" />
                    <span>Sort:</span>
                  </label>
                  <select
                    id="sort-by-select"
                    value={criteria.sortBy}
                    onChange={(e) =>
                      updateCriteria(
                        "sortBy",
                        e.target.value as "recent" | "price-low" | "price-high" | "rating"
                      )
                    }
                    className="text-xs font-medium bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs px-2.5 py-1.5 text-[#202824] focus:outline-hidden focus:border-[#183C32] cursor-pointer"
                  >
                    <option value="recent">Recently Added</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Active Filter Chips */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-semibold text-[#6A726B]">Active Filters:</span>
                  {criteria.search && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xs bg-[#EBEAE3] text-[#183C32] text-xs font-medium border border-[#DCDBCF]">
                      &ldquo;{criteria.search}&rdquo;
                      <button onClick={() => updateCriteria("search", "")} className="hover:text-[#B93838]">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {criteria.category !== "All" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xs bg-[#EBEAE3] text-[#183C32] text-xs font-medium border border-[#DCDBCF]">
                      {criteria.category}
                      <button onClick={() => updateCriteria("category", "All")} className="hover:text-[#B93838]">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {criteria.location && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xs bg-[#EBEAE3] text-[#183C32] text-xs font-medium border border-[#DCDBCF]">
                      Loc: {criteria.location}
                      <button onClick={() => updateCriteria("location", "")} className="hover:text-[#B93838]">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {criteria.maxPrice < 1500 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xs bg-[#EBEAE3] text-[#183C32] text-xs font-medium border border-[#DCDBCF]">
                      &lt; ${criteria.maxPrice}/day
                      <button onClick={() => updateCriteria("maxPrice", 1500)} className="hover:text-[#B93838]">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {criteria.inStockOnly && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xs bg-[#EBEAE3] text-[#183C32] text-xs font-medium border border-[#DCDBCF]">
                      In Stock Only
                      <button onClick={() => updateCriteria("inStockOnly", false)} className="hover:text-[#B93838]">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {criteria.verifiedOnly && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xs bg-[#EBEAE3] text-[#183C32] text-xs font-medium border border-[#DCDBCF]">
                      Verified Owners
                      <button onClick={() => updateCriteria("verifiedOnly", false)} className="hover:text-[#B93838]">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={resetCriteria}
                    className="text-xs text-[#8A948D] hover:text-[#B93838] underline ml-1 cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Equipment Cards Grid */}
              {isLoading && filteredEquipment.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="animate-pulse bg-white border border-[#E5E4DC] rounded-xs h-96 overflow-hidden">
                      <div className="h-48 bg-[#EBEAE3]" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-[#EBEAE3] w-2/3" />
                        <div className="h-3 bg-[#EBEAE3] w-1/2" />
                        <div className="h-8 bg-[#EBEAE3] w-full mt-8" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredEquipment.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEquipment.map((equipment: Equipment, index: number) => (
                    <EquipmentCard
                      key={equipment.id}
                      equipment={equipment}
                      priority={index < 6}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-sm border border-[#E5E4DC] text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#EBEAE3] text-[#6A726B] flex items-center justify-center mx-auto">
                    <PackageOpen className="w-7 h-7" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-[#183C32]">
                    No equipment matches your current filters
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6A726B] max-w-md mx-auto">
                    Try clearing specific filters, broadening your search keyword, or adjusting the price threshold.
                  </p>
                  <button
                    onClick={resetCriteria}
                    className="px-4 py-2 bg-[#183C32] hover:bg-[#245344] text-white text-xs font-semibold rounded-xs transition-colors shadow-2xs"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
            <div className="w-full max-w-sm bg-white h-full p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-200">
              <EquipmentFilters
                criteria={criteria}
                updateCriteria={updateCriteria}
                resetCriteria={resetCriteria}
                allEquipment={equipmentList}
                isMobile={true}
                onCloseMobile={() => setMobileFilterOpen(false)}
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function EquipmentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F7F6F1]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#183C32]" />
        </div>
      }
    >
      <EquipmentCatalogContent />
    </Suspense>
  );
}
