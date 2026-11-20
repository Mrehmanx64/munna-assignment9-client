"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, PackageSearch } from "lucide-react";
import { EquipmentCard } from "@/components/equipment/EquipmentCard";
import { useApp } from "@/context/AppContext";

export function FeaturedSection() {
  const { equipmentList = [] } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Construction Equipment",
    "Photography Equipment",
    "Agriculture Equipment",
    "Electronics",
    "Vehicles & Transportation",
  ];

  const filteredEquipment = useMemo(() => {
    if (!Array.isArray(equipmentList)) return [];
    const filtered =
      selectedCategory === "All"
        ? equipmentList
        : equipmentList.filter(
            (item) =>
              item.category?.trim().toLowerCase() ===
              selectedCategory.trim().toLowerCase()
          );
    return filtered.slice(0, 6);
  }, [equipmentList, selectedCategory]);

  return (
    <section className="border-b border-[#E7E7DF] bg-[#F7F6F1] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-[#D99A42] uppercase">
              <Sparkles className="h-4 w-4" />
              <span>Curated Fleet Listings</span>
            </div>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-[#183C32] sm:text-4xl">
              Equipment Worth Exploring
            </h2>
            <p className="max-w-xl text-sm text-[#6A726B] sm:text-base">
              Explore premium equipment, professional machinery, photography gear, and specialized assets ready for your next project.
            </p>
          </div>

          <Link
            href="/equipment"
            className="group inline-flex items-center gap-2 self-start text-sm font-semibold text-[#183C32] hover:text-[#245344] md:self-auto"
          >
            <span>View Complete Catalog ({equipmentList.length})</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Category Filters */}
        <div className="no-scrollbar mb-8 flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`border px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "border-[#183C32] bg-[#183C32] text-white"
                  : "border-[#DCDBCF] bg-white text-[#525B55] hover:border-[#183C32] hover:text-[#183C32]"
              }`}
            >
              {cat === "All" ? "All Equipment" : cat.replace(" Equipment", "")}
            </button>
          ))}
        </div>

        {/* Equipment Grid — no motion wrappers, cards render immediately */}
        {filteredEquipment.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {filteredEquipment.map((equipment, index) => (
              <EquipmentCard
                key={equipment.id}
                equipment={equipment}
                priority={index < 3}
              />
            ))}
          </div>
        ) : (
          <div className="border border-[#E7E7DF] bg-white px-6 py-16 text-center">
            <PackageSearch className="mx-auto mb-4 h-12 w-12 text-[#A5AA9F]" />
            <h3 className="mb-2 text-xl font-bold text-[#183C32]">No Equipment Found</h3>
            <p className="mb-6 text-sm text-[#6A726B]">
              {selectedCategory === "All"
                ? "There are currently no equipment listings available."
                : `No equipment found in ${selectedCategory}. Try another category.`}
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className="bg-[#183C32] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#245344]"
            >
              View All Equipment
            </button>
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 border border-[#DCDBCF] bg-[#EBEAE3] p-6 sm:flex-row sm:p-8">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-heading text-lg font-bold text-[#183C32]">
              Need specialized or high-capacity equipment?
            </h3>
            <p className="text-xs text-[#5C665F] sm:text-sm">
              Our dispatch team sources custom cranes, heavy lowboys, and cinema production packages within 24 hours.
            </p>
          </div>
          <Link
            href="/equipment"
            className="bg-[#183C32] px-5 py-3 text-xs font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#245344]"
          >
            Request Fleet Concierge
          </Link>
        </div>
      </div>
    </section>
  );
}
