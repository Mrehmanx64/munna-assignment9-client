"use client";

import React from "react";
import { Search, MapPin, Filter, RotateCcw } from "lucide-react";
import { FilterCriteria } from "@/hooks/useEquipmentFilter";
import { Equipment } from "@/types";

interface EquipmentFiltersProps {
  criteria: FilterCriteria;
  updateCriteria: <K extends keyof FilterCriteria>(
    key: K,
    value: FilterCriteria[K]
  ) => void;
  resetCriteria: () => void;
  allEquipment: Equipment[];
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export function EquipmentFilters({
  criteria,
  updateCriteria,
  resetCriteria,
  allEquipment,
  isMobile = false,
  onCloseMobile,
}: EquipmentFiltersProps) {
  const categories = [
    "All",
    "Construction Equipment",
    "Photography Equipment",
    "Vehicles & Transportation",
    "Agriculture Equipment",
    "Electronics",
    "Event Equipment",
  ];

  return (
    <div className={`space-y-6 ${isMobile ? "" : "bg-white p-5 rounded-sm border border-[#E5E4DC] shadow-2xs sticky top-28"}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#ECEBE3] pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#183C32]" />
          <h2 className="font-heading text-sm font-bold text-[#183C32] uppercase tracking-wider">
            Filter Fleet
          </h2>
        </div>
        <button
          onClick={resetCriteria}
          className="text-xs text-[#8A948D] hover:text-[#183C32] flex items-center gap-1 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Keyword Search */}
      <div>
        <label htmlFor={`filter-search-${isMobile ? 'mobile' : 'desktop'}`} className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1.5">
          Equipment / Model
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-[#8A948D] absolute left-2.5 top-2.5 pointer-events-none" />
          <input
            id={`filter-search-${isMobile ? 'mobile' : 'desktop'}`}
            type="text"
            placeholder="Search keywords..."
            value={criteria.search}
            onChange={(e) => updateCriteria("search", e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32] focus:bg-white placeholder:text-[#9AA39C]"
          />
        </div>
      </div>

      {/* Location Filter */}
      <div>
        <label htmlFor={`filter-location-${isMobile ? 'mobile' : 'desktop'}`} className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1.5">
          Jobsite / Yard Location
        </label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-[#8A948D] absolute left-2.5 top-2.5 pointer-events-none" />
          <input
            id={`filter-location-${isMobile ? 'mobile' : 'desktop'}`}
            type="text"
            placeholder="e.g. Oakland, Burbank..."
            value={criteria.location}
            onChange={(e) => updateCriteria("location", e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32] focus:bg-white placeholder:text-[#9AA39C]"
          />
        </div>
      </div>

      {/* Category Checklist */}
      <div>
        <span className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-2">
          Category
        </span>
        <div className="space-y-1">
          {categories.map((cat) => {
            const count =
              cat === "All"
                ? allEquipment.length
                : allEquipment.filter((e) => e.category === cat).length;
            const isSelected = criteria.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => updateCriteria("category", cat)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xs text-xs cursor-pointer text-left transition-colors ${
                  isSelected
                    ? "bg-[#183C32] text-white font-semibold"
                    : "text-[#555E57] hover:bg-[#F7F6F1]"
                }`}
              >
                <span className="truncate pr-2">
                  {cat === "All" ? "All Categories" : cat}
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? "bg-[#245344] text-[#D99A42]" : "text-[#8A948D]"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1.5">
          <span>Max Daily Rate</span>
          <span className="text-[#183C32] font-extrabold text-xs">
            ${criteria.maxPrice} /day
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="1500"
          step="50"
          value={criteria.maxPrice}
          onChange={(e) => updateCriteria("maxPrice", Number(e.target.value))}
          className="w-full accent-[#183C32] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#8A948D] mt-1 font-mono">
          <span>$100</span>
          <span>$750</span>
          <span>$1,500</span>
        </div>
      </div>

      {/* Rental Duration Frequency */}
      <div>
        <label htmlFor={`filter-frequency-${isMobile ? 'mobile' : 'desktop'}`} className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1.5">
          Rental Frequency
        </label>
        <select
          id={`filter-frequency-${isMobile ? 'mobile' : 'desktop'}`}
          value={criteria.rentalType}
          onChange={(e) => updateCriteria("rentalType", e.target.value)}
          className="w-full px-2.5 py-1.5 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32] focus:bg-white cursor-pointer"
        >
          <option value="all">All Durations</option>
          <option value="daily">Daily Rental</option>
          <option value="weekly">Weekly Rental</option>
          <option value="monthly">Monthly Rental</option>
          <option value="hourly">Hourly Rental</option>
        </select>
      </div>

      {/* Toggle Options */}
      <div className="pt-2 border-t border-[#ECEBE3] space-y-2.5">
        <label className="flex items-center gap-2 text-xs text-[#4A524D] cursor-pointer">
          <input
            type="checkbox"
            checked={criteria.inStockOnly}
            onChange={(e) => updateCriteria("inStockOnly", e.target.checked)}
            className="w-4 h-4 rounded-xs text-[#183C32] border-[#DCDBCF] focus:ring-[#183C32]"
          />
          <span>In-Stock Ready For Dispatch</span>
        </label>

        <label className="flex items-center gap-2 text-xs text-[#4A524D] cursor-pointer">
          <input
            type="checkbox"
            checked={criteria.verifiedOnly}
            onChange={(e) => updateCriteria("verifiedOnly", e.target.checked)}
            className="w-4 h-4 rounded-xs text-[#183C32] border-[#DCDBCF] focus:ring-[#183C32]"
          />
          <span>Verified Fleet Owners Only</span>
        </label>
      </div>

      {/* Mobile Close / Apply Button */}
      {isMobile && onCloseMobile && (
        <div className="pt-4 border-t border-[#ECEBE3]">
          <button
            onClick={onCloseMobile}
            className="w-full py-2.5 bg-[#183C32] text-white text-xs font-semibold rounded-xs transition-colors"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}
