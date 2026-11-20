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
} from "lucide-react";

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

  return (
    <section className="relative overflow-hidden bg-[#F7F6F1] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#E7E7DF]">
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E4DC_1px,transparent_1px),linear-gradient(to_bottom,#E5E4DC_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Search */}
          <div className="lg:col-span-7 space-y-8">
            {/* Editorial Category Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xs bg-[#EBEAE3] border border-[#DCDBCF] text-xs font-bold uppercase tracking-widest text-[#183C32]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D99A42]" />
              Industrial Fleet Marketplace
              <span className="text-[#8A948D]">|</span>
              <span className="text-[#59635C] font-semibold">Tier-1 Equipment</span>
            </div>

            {/* Editorial Headline */}
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
              <p className="pt-2 text-base sm:text-lg text-[#525B55] max-w-xl leading-relaxed font-normal">
                Access reliable equipment for every project. Discover, compare, and rent from trusted equipment owners across heavy construction, cinema, agriculture, and high-demand power systems.
              </p>
            </div>

            {/* Interactive Search Box */}
            <form
              onSubmit={handleSearch}
              className="bg-white p-3 sm:p-4 rounded-sm border border-[#DCDBCF] shadow-sm max-w-2xl"
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
                      placeholder="e.g. Excavator, Cinema..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm text-[#202824] bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs focus:outline-hidden focus:border-[#183C32] focus:bg-white placeholder:text-[#9AA39C]"
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
                      className="w-full pl-9 pr-7 py-2 text-sm text-[#202824] bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs focus:outline-hidden focus:border-[#183C32] focus:bg-white appearance-none cursor-pointer"
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
                      placeholder="City or Bay Area"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm text-[#202824] bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs focus:outline-hidden focus:border-[#183C32] focus:bg-white placeholder:text-[#9AA39C]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="mt-3.5 pt-3 border-t border-[#ECEBE3] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs text-[#6A726B]">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B4F]" />
                    Instant availability
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D99A42]" />
                    Insured fleet
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#183C32] hover:bg-[#245344] text-[#F7F6F1] text-sm font-semibold rounded-xs transition-colors flex items-center justify-center gap-2 shadow-xs group"
                >
                  <span>Search Equipment</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </form>

            {/* Direct CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                href="/equipment"
                className="px-6 py-3 bg-[#183C32] text-[#F7F6F1] font-semibold text-sm rounded-xs hover:bg-[#245344] transition-colors shadow-xs inline-flex items-center gap-2"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/dashboard/owner/add"
                className="px-6 py-3 bg-white border border-[#DCDBCF] text-[#183C32] font-semibold text-sm rounded-xs hover:bg-[#EBEAE3] transition-colors inline-flex items-center gap-2"
              >
                <span>List Your Equipment</span>
                <Sparkles className="w-4 h-4 text-[#D99A42]" />
              </Link>
            </div>
          </div>

          {/* Right Column: Asymmetric Industrial Hero Photography */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Large Image */}
              <div className="relative h-[430px] sm:h-[480px] w-full rounded-sm overflow-hidden border border-[#DCDBCF] shadow-lg bg-[#EAE8DE]">
                <Image
                  src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=85"
                  alt="CAT 320 GC Heavy Hydraulic Excavator on commercial jobsite"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                {/* Overlaid Bottom Title */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xs bg-[#11231D]/90 backdrop-blur-md border border-[#234A3C] text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#D99A42]">
                        Featured Machine
                      </span>
                      <p className="text-sm font-bold">CAT 320 GC Excavator</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-extrabold text-white">$650</span>
                      <span className="text-xs text-[#98A39C]"> /day</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-[#1F4336] flex items-center justify-between text-[11px] text-[#A6B2AB]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#D99A42]" /> Oakland Yard, CA
                    </span>
                    <span className="text-[#64D294] font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#48C774] animate-pulse" />
                      Ready for Dispatch
                    </span>
                  </div>
                </div>
              </div>

              {/* Secondary Floating Offset Badge */}
              <div className="absolute -bottom-6 -left-6 hidden sm:block p-4 bg-white border border-[#DCDBCF] rounded-xs shadow-md max-w-xs z-10 animate-in fade-in slide-in-from-bottom-3 duration-500">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xs bg-[#183C32] flex items-center justify-center text-[#D99A42] shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#183C32] uppercase tracking-wide">
                      Rapid Jobsite Mobilization
                    </p>
                    <p className="text-[11px] text-[#555E57] mt-0.5">
                      Average dispatch under 4 hours across major metropolitan yards.
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Verified Badge */}
              <div className="absolute -top-4 -right-4 hidden sm:flex items-center gap-2 px-3 py-2 bg-[#183C32] text-white text-xs font-semibold rounded-xs shadow-md border border-[#245344]">
                <ShieldCheck className="w-4 h-4 text-[#D99A42]" />
                <span>$2.5M Commercial COI</span>
              </div>
            </div>
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
