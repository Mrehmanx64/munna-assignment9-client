"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MOCK_CATEGORIES } from "@/data/mockData";
import { equipmentApi } from "@/lib/api";

export function CategoriesSection() {
  const { data: categoryStats } = useQuery({
    queryKey: ["equipmentCategories"],
    queryFn: () => equipmentApi.getCategories(),
    staleTime: 60000,
  });

  const categories = MOCK_CATEGORIES.map((cat) => {
    const liveMatch = Array.isArray(categoryStats)
      ? categoryStats.find(
          (c: any) =>
            (c.category || c.name || c._id)?.toString().toLowerCase() ===
            cat.name.toLowerCase()
        )
      : null;
    return {
      ...cat,
      count: liveMatch?.count !== undefined ? liveMatch.count : cat.count,
    };
  });

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#E7E7DF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D99A42]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#183C32]" />
              <span>Fleet Classification</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#183C32] tracking-tight">
              Primary Equipment Categories
            </h2>
            <p className="text-sm sm:text-base text-[#6A726B] max-w-xl">
              Engineered for specialized jobsite requirements. Filter and deploy equipment tailored to your exact operational scope.
            </p>
          </div>

          <Link
            href="/equipment"
            className="text-xs font-bold uppercase tracking-widest text-[#183C32] hover:text-[#245344] inline-flex items-center gap-1.5 group self-start md:self-auto border-b border-[#183C32] pb-0.5 cursor-pointer"
          >
            <span>Explore All 6 Categories</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: (index % 3) * 0.1 }}
            >
              <Link
                href={`/equipment?category=${encodeURIComponent(cat.name)}`}
                className="group relative rounded-sm overflow-hidden border border-[#E5E4DC] hover:border-[#183C32] transition-all duration-300 shadow-2xs hover:shadow-lg flex flex-col h-[340px] focus:outline-hidden"
              >
                {/* Background Photo */}
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  unoptimized
                  priority={index < 2}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-700"
                />
                {/* Gradient Overlay for Editorial Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#11231D]/95 via-[#11231D]/60 to-black/20 group-hover:from-[#11231D]/90 transition-colors" />

                {/* Top Tag & Price */}
                <div className="relative p-5 sm:p-6 flex items-center justify-between z-10">
                  <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-white/90 text-[#183C32] rounded-xs backdrop-blur-xs shadow-2xs">
                    {cat.count} Units Listed
                  </span>
                  <span className="text-xs font-semibold text-[#F7F6F1] bg-[#183C32]/80 px-2.5 py-1 rounded-xs backdrop-blur-xs border border-[#2B5446]">
                    From ${cat.startingPrice}/day
                  </span>
                </div>

                {/* Bottom Editorial Content */}
                <div className="relative mt-auto p-5 sm:p-6 z-10 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-xl font-bold text-white group-hover:text-[#D99A42] transition-colors">
                      {cat.name}
                    </h3>
                    <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#D99A42] text-white group-hover:text-[#183C32] flex items-center justify-center transition-colors shrink-0">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-xs text-[#ECEFEA]/80 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
