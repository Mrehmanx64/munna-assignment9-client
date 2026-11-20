"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  PackageOpen,
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { EquipmentCard } from "@/components/equipment/EquipmentCard";
import { useApp } from "@/context/AppContext";

function EquipmentCatalogContent() {
  const searchParams = useSearchParams();
  const { equipmentList } = useApp();

  // Search & Filter State
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All";
  const initialLocation = searchParams.get("location") || "";

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState<string>(initialLocation);
  const [rentalType, setRentalType] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(1200);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("recent");
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Available categories
  const categories = [
    "All",
    "Construction Equipment",
    "Photography Equipment",
    "Vehicles & Transportation",
    "Agriculture Equipment",
    "Electronics",
    "Event Equipment",
  ];

  // Filtering & Sorting Logic
  const filteredEquipment = useMemo(() => {
    return equipmentList
      .filter((eq) => {
        // Search by keyword in title, brand, or model
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = eq.title.toLowerCase().includes(q);
          const matchBrand = eq.brand.toLowerCase().includes(q);
          const matchModel = eq.model.toLowerCase().includes(q);
          if (!matchTitle && !matchBrand && !matchModel) return false;
        }

        // Category filter
        if (selectedCategory !== "All" && eq.category !== selectedCategory) {
          return false;
        }

        // Location filter
        if (selectedLocation.trim()) {
          const loc = selectedLocation.toLowerCase();
          if (!eq.location.toLowerCase().includes(loc)) return false;
        }

        // Rental Type filter
        if (rentalType !== "all" && eq.rentalType !== rentalType) {
          return false;
        }

        // Price filter
        if (eq.rentalPrice > maxPrice) {
          return false;
        }

        // In Stock filter
        if (inStockOnly && eq.availableQuantity < 1) {
          return false;
        }

        // Verified Owner filter
        if (verifiedOnly && !eq.ownerVerified) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.rentalPrice - b.rentalPrice;
        if (sortBy === "price-high") return b.rentalPrice - a.rentalPrice;
        if (sortBy === "rating") return b.rating - a.rating;
        // Default recent
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [
    equipmentList,
    search,
    selectedCategory,
    selectedLocation,
    rentalType,
    maxPrice,
    inStockOnly,
    verifiedOnly,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedLocation("");
    setRentalType("all");
    setMaxPrice(1200);
    setInStockOnly(false);
    setVerifiedOnly(false);
    setSortBy("recent");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F1]">
      <Navbar />

      <main className="flex-1">
        {/* Editorial Page Header & Breadcrumbs */}
        <div className="bg-[#EBEAE3] border-b border-[#DCDBCF] py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-[#6A726B] mb-3">
              <Link href="/" className="hover:text-[#183C32]">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#183C32] font-semibold">Equipment Catalog</span>
              {selectedCategory !== "All" && (
                <>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-[#183C32]">{selectedCategory}</span>
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

              {/* Mobile Filter Toggle Button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-4 py-2 bg-white border border-[#DCDBCF] rounded-xs text-xs font-bold uppercase tracking-wider text-[#183C32] flex items-center justify-center gap-2 shadow-2xs self-start"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#D99A42]" />
                <span>Filters & Refinements</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Desktop Filter Sidebar (3 cols) */}
            <aside className="hidden lg:block lg:col-span-3 space-y-6">
              <div className="bg-white p-5 rounded-sm border border-[#E5E4DC] shadow-2xs space-y-6 sticky top-28">
                <div className="flex items-center justify-between border-b border-[#ECEBE3] pb-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#183C32]" />
                    <h2 className="font-heading text-sm font-bold text-[#183C32] uppercase tracking-wider">
                      Refine Fleet
                    </h2>
                  </div>
                  <button
                    onClick={resetFilters}
                    className="text-xs text-[#8A948D] hover:text-[#183C32] underline"
                  >
                    Reset All
                  </button>
                </div>

                {/* Keyword Search */}
                <div>
                  <label htmlFor="filter-search" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1.5">
                    Search Name / Brand
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#8A948D] absolute left-2.5 top-2.5" />
                    <input
                      id="filter-search"
                      type="text"
                      placeholder="e.g. Caterpillar, ARRI..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32] focus:bg-white placeholder:text-[#9AA39C]"
                    />
                  </div>
                </div>

                {/* Category Checklist */}
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-2">
                    Category
                  </span>
                  <div className="space-y-1.5">
                    {categories.map((cat) => (
                      <label
                        key={cat}
                        className={`flex items-center justify-between px-2 py-1.5 rounded-xs text-xs cursor-pointer transition-colors ${
                          selectedCategory === cat
                            ? "bg-[#183C32] text-white font-semibold"
                            : "text-[#555E57] hover:bg-[#F7F6F1]"
                        }`}
                      >
                        <span className="truncate pr-2">
                          {cat === "All" ? "All Categories" : cat}
                        </span>
                        <input
                          type="radio"
                          name="category"
                          value={cat}
                          checked={selectedCategory === cat}
                          onChange={() => setSelectedCategory(cat)}
                          className="sr-only"
                        />
                        <span className="text-[10px] opacity-75">
                          {cat === "All"
                            ? equipmentList.length
                            : equipmentList.filter((e) => e.category === cat).length}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Slider */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1.5">
                    <span>Max Daily Rate</span>
                    <span className="text-[#183C32] font-extrabold text-xs">
                      ${maxPrice} /day
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1500"
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#183C32] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#8A948D] mt-1">
                    <span>$100</span>
                    <span>$750</span>
                    <span>$1,500</span>
                  </div>
                </div>

                {/* Rental Frequency */}
                <div>
                  <label htmlFor="filter-rental-type" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1.5">
                    Rental Duration Type
                  </label>
                  <select
                    id="filter-rental-type"
                    value={rentalType}
                    onChange={(e) => setRentalType(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32] focus:bg-white"
                  >
                    <option value="all">All Frequencies</option>
                    <option value="daily">Daily Rates</option>
                    <option value="weekly">Weekly Rates</option>
                    <option value="monthly">Monthly Rates</option>
                    <option value="hourly">Hourly Rates</option>
                  </select>
                </div>

                {/* Toggles */}
                <div className="pt-2 border-t border-[#ECEBE3] space-y-2.5">
                  <label className="flex items-center gap-2 text-xs text-[#4A524D] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="w-4 h-4 rounded-xs text-[#183C32] border-[#DCDBCF] focus:ring-[#183C32]"
                    />
                    <span>Available In Stock Only</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-[#4A524D] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="w-4 h-4 rounded-xs text-[#183C32] border-[#DCDBCF] focus:ring-[#183C32]"
                    />
                    <span>Verified Fleet Owners Only</span>
                  </label>
                </div>
              </div>
            </aside>

            {/* Equipment Grid Section (9 cols) */}
            <div className="lg:col-span-9 space-y-6">
              {/* Controls Bar: Results Count & Sorting */}
              <div className="bg-white p-3.5 sm:p-4 rounded-sm border border-[#E5E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="text-xs text-[#6A726B]">
                  Showing <span className="font-bold text-[#183C32]">{filteredEquipment.length}</span> verified equipment listings
                  {selectedCategory !== "All" && (
                    <span className="font-medium text-[#D99A42]"> in {selectedCategory}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <label htmlFor="sort-by" className="text-xs font-semibold text-[#6A726B] flex items-center gap-1">
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#183C32]" />
                    <span>Sort:</span>
                  </label>
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-xs font-medium bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs px-2.5 py-1.5 text-[#202824] focus:outline-hidden focus:border-[#183C32]"
                  >
                    <option value="recent">Recently Added</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Catalog Grid */}
              {filteredEquipment.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEquipment.map((equipment, index) => (
                    <EquipmentCard
                      key={equipment.id}
                      equipment={equipment}
                      priority={index < 6}
                    />
                  ))}
                </div>
              ) : (
                /* Empty State */
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
                    onClick={resetFilters}
                    className="px-4 py-2 bg-[#183C32] hover:bg-[#245344] text-white text-xs font-semibold rounded-xs transition-colors shadow-2xs"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Modal / Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
            <div className="w-full max-w-sm bg-white h-full p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-200">
              <div className="flex items-center justify-between border-b border-[#ECEBE3] pb-3">
                <h3 className="font-heading text-base font-bold text-[#183C32]">
                  Filter Equipment
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 text-[#6A726B] hover:text-[#183C32]"
                >
                  ✕
                </button>
              </div>

              {/* Mobile Search */}
              <div>
                <label htmlFor="mobile-filter-search" className="block text-xs font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                  Keyword Search
                </label>
                <input
                  id="mobile-filter-search"
                  type="text"
                  placeholder="e.g. Excavator, ARRI..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs"
                />
              </div>

              {/* Mobile Category */}
              <div>
                <label htmlFor="mobile-filter-category" className="block text-xs font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                  Category
                </label>
                <select
                  id="mobile-filter-category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Mobile Price */}
              <div>
                <div className="flex justify-between text-xs font-bold text-[#6A726B] mb-1">
                  <span>Max Price</span>
                  <span className="text-[#183C32]">${maxPrice}/day</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1500"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#183C32]"
                />
              </div>

              {/* Mobile Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-[#ECEBE3]">
                <label className="flex items-center gap-2 text-sm text-[#4A524D]">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-[#183C32]"
                  />
                  <span>Available In Stock</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-[#4A524D]">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="w-4 h-4 text-[#183C32]"
                  />
                  <span>Verified Owners</span>
                </label>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  onClick={() => {
                    resetFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="flex-1 py-2.5 text-center text-xs font-semibold border border-[#DCDBCF] rounded-xs text-[#4A524D]"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-2.5 text-center text-xs font-semibold bg-[#183C32] text-white rounded-xs"
                >
                  Apply Filters
                </button>
              </div>
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
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F7F6F1]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#183C32]" />
      </div>
    }>
      <EquipmentCatalogContent />
    </Suspense>
  );
}
