"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { EquipmentCard } from "@/components/equipment/EquipmentCard";
import { useApp } from "@/context/AppContext";

export function FeaturedSection() {
  const { equipmentList } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Construction Equipment",
    "Photography Equipment",
    "Agriculture Equipment",
    "Electronics",
    "Vehicles & Transportation",
  ];

  const filteredEquipment = equipmentList
    .filter((item) =>
      selectedCategory === "All" ? true : item.category === selectedCategory
    )
    .slice(0, 6);

  return (
    <section className="py-16 sm:py-20 bg-[#F7F6F1] border-b border-[#E7E7DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D99A42]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Fleet Listings</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#183C32] tracking-tight">
              Equipment Worth Exploring
            </h2>
            <p className="text-sm sm:text-base text-[#6A726B] max-w-xl">
              Heavy hydraulic machinery, large-format cinema optics, and certified jobsite equipment ready for scheduled deployment.
            </p>
          </div>

          <Link
            href="/equipment"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#183C32] hover:text-[#245344] group self-start md:self-auto"
          >
            <span>View Complete Catalog ({equipmentList.length})</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-xs whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? "bg-[#183C32] text-white border-[#183C32] shadow-xs"
                  : "bg-white text-[#525B55] border-[#DCDBCF] hover:border-[#183C32] hover:text-[#183C32]"
              }`}
            >
              {cat === "All" ? "All Equipment" : cat.replace(" Equipment", "")}
            </button>
          ))}
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredEquipment.map((equipment, index) => (
            <EquipmentCard
              key={equipment.id}
              equipment={equipment}
              priority={index < 3}
            />
          ))}
        </div>

        {/* Bottom CTA Card Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-sm bg-[#EBEAE3] border border-[#DCDBCF] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-heading text-lg font-bold text-[#183C32]">
              Need specialized or high-capacity equipment not listed here?
            </h3>
            <p className="text-xs sm:text-sm text-[#5C665F]">
              Our dispatch team sources custom cranes, heavy lowboys, and cinema production packages within 24 hours.
            </p>
          </div>
          <Link
            href="/equipment"
            className="px-5 py-2.5 bg-[#183C32] hover:bg-[#245344] text-white text-xs font-semibold rounded-xs transition-colors whitespace-nowrap shadow-xs"
          >
            Request Fleet Concierge
          </Link>
        </div>
      </div>
    </section>
  );
}
