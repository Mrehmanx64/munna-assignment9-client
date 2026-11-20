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
import { MotionReveal } from "@/components/shared/MotionReveal";

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
    <section className="relative overflow-hidden bg-[#F7F6F1] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#E7E7DF]">
      {/* Background Architectural Blueprint Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E2E0D5_1px,transparent_1px),linear-gradient(to_bottom,#E2E0D5_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,#000_80%,transparent_100%)] opacity-40 pointer-events-none" />

      {/* Subtle Top Telemetry Coordinates Watermark */}
      <div className="hidden xl:flex absolute top-3 left-8 right-8 justify-between items-center text-[10px] uppercase font-mono tracking-widest text-[#9AA39B] pointer-events-none select-none">
        <span>[ GRID: 37°48&apos;N 122°16&apos;W // DEPOT: SFO-EAST-04 ]</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34A853] animate-ping" />
          <span>REAL-TIME FLEET TELEMETRY: 247 MACHINES DISPATCH-READY</span>
        </span>
        <span>[ ESCROW COI: $2.5M PER OCCURRENCE ]</span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Search */}
          <div className="lg:col-span-7 space-y-7">
            <MotionReveal delay={0.05} animateOnMount={true}>
              {/* Editorial Category Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xs bg-[#EBEAE3] border border-[#DCDBCF] text-xs font-bold uppercase tracking-widest text-[#183C32]">
                <span className="w-2 h-2 rounded-full bg-[#D99A42]" />
                <span>Industrial Fleet Marketplace</span>
                <span className="text-[#8A948D]">/</span>
                <span className="text-[#59635C] font-semibold">Tier-1 Equipment</span>
              </div>
            </MotionReveal>

            {/* Editorial Headline */}
            <MotionReveal delay={0.1} animateOnMount={true}>
              <div className="space-y-3">
                <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#183C32] leading-[1.08]">
                  Right Equipment.
                  <br />
                  <span className="text-[#202824]">Right When You</span>
                  <br />
                  <span className="italic font-serif text-[#183C32] underline decoration-[#D99A42] decoration-wavy decoration-2">
                    Need It.
                  </span>
                </h1>
                <p className="pt-2 text-base sm:text-lg text-[#525B55] max-w-xl leading-relaxed font-normal">
                  Access reliable equipment for every project. Discover, compare, and rent from trusted equipment owners across heavy construction, cinema, agriculture, and high-demand power systems.
                </p>
              </div>
            </MotionReveal>

            {/* Interactive Search Console */}
            <MotionReveal delay={0.15} animateOnMount={true}>
              <form
                onSubmit={handleSearch}
                className="bg-white p-3.5 sm:p-4 rounded-sm border border-[#DCDBCF] shadow-sm max-w-2xl relative"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Keyword */}
                  <div className="relative">
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
                        className="w-full pl-9 pr-3 py-2 text-sm text-[#202824] bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs focus:outline-hidden focus:border-[#183C32] focus:bg-white placeholder:text-[#9AA39C] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Category Dropdown */}
                  <div className="relative">
                    <label htmlFor="search-category" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                      Category
                    </label>
                    <div className="relative flex items-center">
                      <Tag className="w-4 h-4 text-[#8A948D] absolute left-2.5 pointer-events-none" />
                      <select
                        id="search-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full pl-9 pr-7 py-2 text-sm text-[#202824] bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs focus:outline-hidden focus:border-[#183C32] focus:bg-white appearance-none cursor-pointer transition-colors"
                      >
                        <option value="">All Categories</option>
                        <option value="Construction Equipment">Construction</option>
                        <option value="Photography Equipment">Photography & Cinema</option>
                        <option value="Vehicles & Transportation">Vehicles & Haulers</option>
                        <option value="Agriculture Equipment">Agriculture</option>
                        <option value="Electronics">Electronics & Power</option>
                        <option value="Event Equipment">Event Production</option>
                      </select>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="relative">
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
                        className="w-full pl-9 pr-3 py-2 text-sm text-[#202824] bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs focus:outline-hidden focus:border-[#183C32] focus:bg-white placeholder:text-[#9AA39C] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="mt-3 pt-2.5 border-t border-[#ECEBE3] flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[11px] font-semibold text-[#788279] mr-1 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-[#D99A42]" /> Quick Fleet:
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuickSearch("CAT 320", "Construction Equipment")}
                    className="px-2 py-0.5 rounded-xs bg-[#F2F1EA] hover:bg-[#E5E4DC] text-[#343D36] text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    Excavators
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickSearch("ARRI Alexa", "Photography Equipment")}
                    className="px-2 py-0.5 rounded-xs bg-[#F2F1EA] hover:bg-[#E5E4DC] text-[#343D36] text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    Cinema Rigs
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickSearch("Boom Lift", "Construction Equipment")}
                    className="px-2 py-0.5 rounded-xs bg-[#F2F1EA] hover:bg-[#E5E4DC] text-[#343D36] text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    Aerial Lifts
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickSearch("Tractor", "Agriculture Equipment")}
                    className="px-2 py-0.5 rounded-xs bg-[#F2F1EA] hover:bg-[#E5E4DC] text-[#343D36] text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    Tractors
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickSearch("Generator", "Electronics")}
                    className="px-2 py-0.5 rounded-xs bg-[#F2F1EA] hover:bg-[#E5E4DC] text-[#343D36] text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    Generators
                  </button>
                </div>

                {/* Submit CTA & Trust Badges */}
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
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#183C32] hover:bg-[#245344] text-[#F7F6F1] text-sm font-semibold rounded-xs transition-colors flex items-center justify-center gap-2 shadow-xs group cursor-pointer"
                  >
                    <span>Search Equipment</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </form>
            </MotionReveal>

            {/* Direct CTA Buttons */}
            <MotionReveal delay={0.2} animateOnMount={true}>
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link
                  href="/equipment"
                  className="px-6 py-3 bg-[#183C32] text-[#F7F6F1] font-semibold text-sm rounded-xs hover:bg-[#245344] transition-colors shadow-xs inline-flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#D99A42]" />
                  <span>Explore Equipment Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/dashboard/owner/add"
                  className="px-6 py-3 bg-white border border-[#DCDBCF] text-[#183C32] font-semibold text-sm rounded-xs hover:bg-[#EBEAE3] transition-colors inline-flex items-center gap-2 shadow-2xs"
                >
                  <Sparkles className="w-4 h-4 text-[#D99A42]" />
                  <span>List Your Equipment</span>
                </Link>
              </div>
            </MotionReveal>
          </div>

          {/* Right Column: Asymmetric Industrial Hero Photography & Telemetry */}
          <div className="lg:col-span-5 relative">
            <MotionReveal delay={0.2} direction="left" animateOnMount={true}>
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Primary Large Heavy Machinery Card */}
                <div className="relative h-[430px] sm:h-[480px] w-full rounded-sm overflow-hidden border border-[#DCDBCF] shadow-xl bg-[#202824]">
                  {/* Subtle Blueprint Grid Pattern as Fallback */}
                  <div className="absolute inset-0 bg-[radial-gradient(#394B43_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />

                  <Image
                    src="https://images.unsplash.com/photo-1768085091650-e8e89ef57b76?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                    alt="CAT 320 GC Heavy Hydraulic Excavator on commercial jobsite"
                    fill
                    priority
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

                  {/* Top Status Bar Over Image */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-xs bg-[#11231D]/85 backdrop-blur-md border border-[#2B5445] text-white text-[11px] font-mono uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#48C774] animate-pulse" />
                      TELEMATICS: ONLINE
                    </span>
                    <span className="px-2.5 py-1 rounded-xs bg-[#D99A42] text-[#183C32] text-[10px] font-extrabold uppercase tracking-wider">
                      Tier 1 Certified
                    </span>
                  </div>

                  {/* Overlaid Bottom Title & Telemetry */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xs bg-[#11231D]/95 backdrop-blur-md border border-[#234A3C] text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#D99A42]">
                          Featured Heavy Machinery
                        </span>
                        <p className="text-base font-extrabold text-white">CAT 320 GC Hydraulic Excavator</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-extrabold text-[#F7F6F1]">$650</span>
                        <span className="text-xs text-[#98A39C]"> /day</span>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#1F4336] grid grid-cols-2 gap-2 text-[11px] text-[#A6B2AB]">
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-[#D99A42] shrink-0" /> Oakland Heavy Yard, CA
                      </span>
                      <span className="text-right text-[#64D294] font-medium flex items-center justify-end gap-1">
                        <Activity className="w-3 h-3 text-[#64D294]" /> 52,000 lbs • 162 HP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Secondary Asymmetric Floating Card: Cinema & Precision Optics */}
                <div className="absolute -bottom-8 -left-6 hidden sm:block p-3.5 bg-white border border-[#DCDBCF] rounded-xs shadow-xl max-w-xs z-10">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xs overflow-hidden shrink-0 border border-[#E7E7DF] bg-[#202824]">
                      <Image
                        src="https://images.unsplash.com/photo-1607276159787-9ef4db5c0d0b?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                        alt="Cinema Equipment"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#D99A42]">Cinema Optics</span>
                        <span className="text-[9px] text-[#788279]">• 4K HDR</span>
                      </div>
                      <p className="text-xs font-bold text-[#183C32] truncate">ARRI Alexa 35 Kit</p>
                      <p className="text-[11px] font-extrabold text-[#202824]">$850 <span className="text-[10px] font-normal text-[#6A726B]">/day</span></p>
                    </div>
                  </div>
                </div>

                {/* Floating Metric Pill: Rapid Mobilization */}
                <div className="absolute -top-4 -right-4 hidden sm:flex items-center gap-2 px-3 py-2 bg-[#183C32] text-white text-xs font-semibold rounded-xs shadow-lg border border-[#245344] z-10">
                  <Clock className="w-4 h-4 text-[#D99A42]" />
                  <span>&lt; 4hr Jobsite Mobilization</span>
                </div>

                {/* Floating Metric Pill: Commercial Insurance */}
                <div className="absolute top-1/2 -right-6 hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/95 backdrop-blur-xs text-[#183C32] text-xs font-bold rounded-xs shadow-md border border-[#DCDBCF] z-10">
                  <Award className="w-3.5 h-3.5 text-[#D99A42]" />
                  <span>$2.5M COI Escrow Protection</span>
                </div>
              </div>
            </MotionReveal>
          </div>
        </div>

        {/* Bottom Metrics Bar */}
        <div className="mt-16 pt-10 border-t border-[#E5E4DC]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="border-l-2 border-[#183C32] pl-4">
              <p className="font-heading text-2xl sm:text-3xl font-extrabold text-[#183C32]">
                $42M+
              </p>
              <p className="text-xs uppercase tracking-wider font-semibold text-[#6A726B] mt-0.5">
                Insured Fleet Value
              </p>
            </div>

            <div className="border-l-2 border-[#D99A42] pl-4">
              <p className="font-heading text-2xl sm:text-3xl font-extrabold text-[#183C32]">
                1,420+
              </p>
              <p className="text-xs uppercase tracking-wider font-semibold text-[#6A726B] mt-0.5">
                Verified Contractors
              </p>
            </div>

            <div className="border-l-2 border-[#183C32] pl-4">
              <p className="font-heading text-2xl sm:text-3xl font-extrabold text-[#183C32]">
                99.8%
              </p>
              <p className="text-xs uppercase tracking-wider font-semibold text-[#6A726B] mt-0.5">
                On-Time Site Delivery
              </p>
            </div>

            <div className="border-l-2 border-[#D99A42] pl-4">
              <p className="font-heading text-2xl sm:text-3xl font-extrabold text-[#183C32]">
                24 / 7
              </p>
              <p className="text-xs uppercase tracking-wider font-semibold text-[#6A726B] mt-0.5">
                Technical Field Support
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
