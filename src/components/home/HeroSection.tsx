"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Tag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  SlidersHorizontal,
  Flame,
  Activity,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("search", keyword.trim());
    if (category) params.set("category", category);
    if (location.trim()) params.set("location", location.trim());
    router.push(`/equipment?${params.toString()}`);
  };

  const setQuickSearch = (kw: string, cat: string) => {
    setKeyword(kw);
    setCategory(cat);
  };

  return (
    <section className="relative overflow-hidden bg-[#F7F6F1] pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-[#E7E7DF]">
      {/* Background Blueprint Grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right,#E2E0D5 1px,transparent 1px),linear-gradient(to bottom,#E2E0D5 1px,transparent 1px)",
          backgroundSize: "3.5rem 3.5rem",
          opacity: 0.4,
        }}
      />

      {/* Top Telemetry Bar (xl+) */}
      <div className="hidden xl:flex absolute top-3 left-8 right-8 justify-between items-center text-[10px] uppercase font-mono tracking-widest text-[#9AA39B] pointer-events-none select-none">
        <span>[ GRID: 37°48&apos;N 122°16&apos;W // DEPOT: SFO-EAST-04 ]</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34A853] animate-ping" />
          <span>REAL-TIME FLEET TELEMETRY: 247 MACHINES DISPATCH-READY</span>
        </span>
        <span>[ ESCROW COI: $2.5M PER OCCURRENCE ]</span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

          {/* ── LEFT COLUMN ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#EBEAE3] border border-[#DCDBCF] text-xs font-bold uppercase tracking-widest text-[#183C32]">
              <span className="w-2 h-2 rounded-full bg-[#D99A42]" />
              <span>Industrial Fleet Marketplace</span>
              <span className="text-[#8A948D]">/</span>
              <span className="text-[#59635C] font-semibold">Tier-1 Equipment</span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#183C32] leading-[1.08]">
                Right Equipment.
                <br />
                <span className="text-[#202824]">Right When You</span>
                <br />
                <span className="italic font-serif text-[#183C32] underline decoration-[#D99A42] decoration-wavy decoration-2">
                  Need It.
                </span>
              </h1>
              <p className="pt-2 text-base sm:text-lg text-[#525B55] max-w-xl leading-relaxed">
                Access reliable equipment for every project. Discover, compare, and rent from trusted equipment owners across heavy construction, cinema, agriculture, and high-demand power systems.
              </p>
            </div>

            {/* Search Console */}
            <form
              onSubmit={handleSearch}
              className="bg-white p-3.5 sm:p-4 border border-[#DCDBCF] shadow-sm max-w-2xl"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Keyword */}
                <div>
                  <label htmlFor="search-keyword" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                    Equipment Keyword
                  </label>
                  <div className="relative flex items-center">
                    <Search className="w-4 h-4 text-[#8A948D] absolute left-2.5 pointer-events-none" />
                    <input
                      id="search-keyword"
                      type="text"
                      placeholder="e.g. Excavator, Crane..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm text-[#202824] bg-[#F7F6F1] border border-[#E0DFD6] focus:outline-none focus:border-[#183C32] focus:bg-white placeholder:text-[#9AA39C] transition-colors"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="search-category" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                    Category
                  </label>
                  <div className="relative flex items-center">
                    <Tag className="w-4 h-4 text-[#8A948D] absolute left-2.5 pointer-events-none" />
                    <select
                      id="search-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full pl-9 pr-7 py-2 text-sm text-[#202824] bg-[#F7F6F1] border border-[#E0DFD6] focus:outline-none focus:border-[#183C32] focus:bg-white appearance-none cursor-pointer transition-colors"
                    >
                      <option value="">All Categories</option>
                      <option value="Construction Equipment">Construction</option>
                      <option value="Photography Equipment">Photography &amp; Cinema</option>
                      <option value="Vehicles & Transportation">Vehicles &amp; Haulers</option>
                      <option value="Agriculture Equipment">Agriculture</option>
                      <option value="Electronics">Electronics &amp; Power</option>
                      <option value="Event Equipment">Event Production</option>
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="search-location" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                    Jobsite Location
                  </label>
                  <div className="relative flex items-center">
                    <MapPin className="w-4 h-4 text-[#8A948D] absolute left-2.5 pointer-events-none" />
                    <input
                      id="search-location"
                      type="text"
                      placeholder="City, Yard or Zip"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm text-[#202824] bg-[#F7F6F1] border border-[#E0DFD6] focus:outline-none focus:border-[#183C32] focus:bg-white placeholder:text-[#9AA39C] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Fleet Chips */}
              <div className="mt-3 pt-2.5 border-t border-[#ECEBE3] flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-[#788279] mr-1 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#D99A42]" /> Quick Fleet:
                </span>
                {[
                  { label: "Excavators", kw: "CAT 320", cat: "Construction Equipment" },
                  { label: "Cinema Rigs", kw: "ARRI Alexa", cat: "Photography Equipment" },
                  { label: "Aerial Lifts", kw: "Boom Lift", cat: "Construction Equipment" },
                  { label: "Tractors", kw: "Tractor", cat: "Agriculture Equipment" },
                  { label: "Generators", kw: "Generator", cat: "Electronics" },
                ].map(({ label, kw, cat }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setQuickSearch(kw, cat)}
                    className="px-2 py-0.5 bg-[#F2F1EA] hover:bg-[#E5E4DC] text-[#343D36] text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Submit */}
              <div className="mt-3 pt-3 border-t border-[#ECEBE3] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs text-[#6A726B]">
                  <span className="flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B4F]" />
                    Real-time availability
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D99A42]" />
                    Insured fleet
                  </span>
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#183C32] hover:bg-[#245344] text-[#F7F6F1] text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>Search Equipment</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                href="/equipment"
                className="px-6 py-3 bg-[#183C32] text-[#F7F6F1] font-semibold text-sm hover:bg-[#245344] transition-colors shadow-sm inline-flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#D99A42]" />
                <span>Explore Equipment Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard/owner/add"
                className="px-6 py-3 bg-white border border-[#DCDBCF] text-[#183C32] font-semibold text-sm hover:bg-[#EBEAE3] transition-colors inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#D99A42]" />
                <span>List Your Equipment</span>
              </Link>
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">

              {/* Primary Image Card */}
              <div className="relative h-[380px] sm:h-[460px] w-full overflow-hidden border border-[#DCDBCF] shadow-xl bg-[#202824]">
                {/* Dot-grid fallback visible while image loads */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: "radial-gradient(#4A6358 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />

                <Image
                  src="https://images.unsplash.com/photo-1768085091650-e8e89ef57b76?q=80&w=1171&auto=format&fit=crop"
                  alt="CAT 320 GC Heavy Hydraulic Excavator on commercial jobsite"
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover object-center hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/25 pointer-events-none" />

                {/* Top HUD */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-[#11231D]/85 border border-[#2B5445] text-white text-[11px] font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#48C774] animate-pulse" />
                    TELEMATICS: ONLINE
                  </span>
                  <span className="px-2.5 py-1 bg-[#D99A42] text-[#183C32] text-[10px] font-extrabold uppercase tracking-wider">
                    Tier 1 Certified
                  </span>
                </div>

                {/* Bottom Info Panel */}
                <div className="absolute bottom-3 left-3 right-3 p-4 bg-[#11231D]/95 border border-[#234A3C] text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#D99A42]">
                        Featured Heavy Machinery
                      </span>
                      <p className="text-sm font-extrabold text-white">CAT 320 GC Hydraulic Excavator</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-extrabold text-[#F7F6F1]">$650</span>
                      <span className="text-xs text-[#98A39C]"> /day</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-[#1F4336] grid grid-cols-2 gap-2 text-[11px] text-[#A6B2AB]">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-[#D99A42] shrink-0" />
                      Oakland Heavy Yard, CA
                    </span>
                    <span className="flex items-center justify-end gap-1 text-[#64D294] font-medium">
                      <Activity className="w-3 h-3" />
                      52,000 lbs · 162 HP
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Cinema Card */}
              <div className="absolute -bottom-8 -left-5 hidden sm:block p-3 bg-white border border-[#DCDBCF] shadow-xl max-w-[220px] z-10">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 shrink-0 overflow-hidden border border-[#E7E7DF] bg-[#202824]">
                    <Image
                      src="https://images.unsplash.com/photo-1607276159787-9ef4db5c0d0b?q=80&w=400&auto=format&fit=crop"
                      alt="Cinema Camera Rig"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#D99A42]">Cinema Optics</span>
                    <p className="text-xs font-bold text-[#183C32] truncate">ARRI Alexa 35 Kit</p>
                    <p className="text-[11px] font-extrabold text-[#202824]">
                      $850 <span className="text-[10px] font-normal text-[#6A726B]">/day</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Top-right badge */}
              <div className="absolute -top-4 -right-3 hidden sm:flex items-center gap-2 px-3 py-2 bg-[#183C32] text-white text-xs font-semibold shadow-lg border border-[#245344] z-10">
                <Clock className="w-4 h-4 text-[#D99A42]" />
                <span>&lt; 4hr Mobilization</span>
              </div>

              {/* Mid-right badge */}
              <div className="absolute top-1/2 -translate-y-1/2 -right-4 hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/95 text-[#183C32] text-xs font-bold shadow-md border border-[#DCDBCF] z-10">
                <Award className="w-3.5 h-3.5 text-[#D99A42]" />
                <span>$2.5M COI Escrow</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Metrics Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 pt-10 border-t border-[#E5E4DC]"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { value: "$42M+", label: "Insured Fleet Value", accent: "#183C32" },
              { value: "1,420+", label: "Verified Contractors", accent: "#D99A42" },
              { value: "99.8%", label: "On-Time Site Delivery", accent: "#183C32" },
              { value: "24/7", label: "Technical Field Support", accent: "#D99A42" },
            ].map(({ value, label, accent }) => (
              <div key={label} className="pl-4" style={{ borderLeft: `2px solid ${accent}` }}>
                <p className="font-heading text-2xl sm:text-3xl font-extrabold text-[#183C32]">{value}</p>
                <p className="text-xs uppercase tracking-wider font-semibold text-[#6A726B] mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
