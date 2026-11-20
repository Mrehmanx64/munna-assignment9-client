import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Building2, Wrench } from "lucide-react";
import { MOCK_REVIEWS, MOCK_USERS } from "@/data/mockData";

export function ReviewsSection() {
  const owners = MOCK_USERS.filter((u) => u.role === "owner");

  return (
    <>
      {/* Customer Reviews Section */}
      <section className="py-20 sm:py-28 bg-[#F7F6F1] border-b border-[#E7E7DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D99A42]">
                <Star className="w-3.5 h-3.5 fill-[#D99A42] text-[#D99A42]" />
                <span>Field-Tested Feedback</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#183C32] tracking-tight">
                Trusted by Foremen, DPs & Fleet Managers
              </h2>
              <p className="text-sm sm:text-base text-[#6A726B] max-w-xl">
                Real feedback from active commercial contractors, studio producers, and agricultural operators who rely on Rentora machinery.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#183C32] bg-[#EBEAE3] px-3.5 py-2 rounded-xs border border-[#DCDBCF] self-start md:self-auto">
              <CheckCircle2 className="w-4 h-4 text-[#2E6B4F]" />
              <span>4.9 / 5.0 Average Equipment Rating</span>
            </div>
          </div>

          {/* 4 Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {MOCK_REVIEWS.map((review) => (
              <div
                key={review.id}
                className="p-6 sm:p-8 rounded-sm bg-white border border-[#E5E4DC] hover:border-[#183C32] transition-colors shadow-2xs flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  {/* Star Rating & Rental Tag */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#D99A42]">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#D99A42] text-[#D99A42]" />
                      ))}
                    </div>
                    <span className="text-[11px] font-semibold text-[#6A726B] bg-[#F7F6F1] px-2.5 py-1 rounded-xs border border-[#ECEBE3]">
                      {review.date}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-[#38413C] leading-relaxed font-normal">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-[#ECEBE3] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#EBEAE3] shrink-0">
                      <Image
                        src={review.customerAvatar}
                        alt={review.customerName}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#183C32]">{review.customerName}</p>
                      <p className="text-xs text-[#6A726B]">{review.customerRole}</p>
                    </div>
                  </div>

                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6A726B] block">
                      Rented Equipment
                    </span>
                    <span className="text-xs font-semibold text-[#183C32] line-clamp-1 max-w-[160px]">
                      {review.equipmentRented}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Equipment Owners Spotlight */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#E7E7DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D99A42]">
              Network of Excellence
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#183C32]">
              Featured Fleet Owners
            </h2>
            <p className="text-xs sm:text-sm text-[#6A726B]">
              Every listed owner is vetted through our 5-point commercial compliance audit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {owners.map((owner) => (
              <div
                key={owner.id}
                className="p-6 rounded-sm bg-[#F7F6F1] border border-[#E5E4DC] flex items-center gap-5 hover:border-[#183C32] transition-colors"
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-[#183C32]">
                  <Image
                    src={owner.avatarUrl}
                    alt={owner.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-base font-bold text-[#183C32]">{owner.name}</h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-[#2E6B4F]/15 text-[#2E6B4F] px-1.5 py-0.5 rounded-xs">
                      <ShieldCheck className="w-3 h-3" /> Certified Owner
                    </span>
                  </div>
                  <p className="text-xs text-[#6A726B]">{owner.address}</p>
                  <div className="flex items-center gap-4 text-xs font-medium text-[#202824] pt-1">
                    <span>{owner.totalRentals} Completed Rentals</span>
                    <span>•</span>
                    <span className="text-[#2E6B4F]">100% Response Rate</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strong Equipment Owner CTA Banner */}
      <section className="py-20 sm:py-24 bg-[#11231D] text-[#ECEFEA] relative overflow-hidden">
        {/* Subtle Background Accent Pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_center,#D99A42_0%,transparent_70%)] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xs bg-[#1A382F] text-xs font-bold uppercase tracking-widest text-[#D99A42] border border-[#234A3C]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Monetize Idle Machinery</span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
                Turn Idle Equipment Into
                <br />
                <span className="text-[#D99A42]">Predictable Monthly Revenue.</span>
              </h2>

              <p className="text-sm sm:text-base text-[#9AA39C] max-w-2xl leading-relaxed">
                Join our network of verified industrial fleet owners. We provide verified contractor vetting, automated insurance waivers, payment escrow, and telematics scheduling so your assets work when you aren&apos;t using them.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-[#D9E3DE]">
                  <CheckCircle2 className="w-4 h-4 text-[#D99A42] shrink-0" />
                  <span>$2.5M Damage Protection</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#D9E3DE]">
                  <Building2 className="w-4 h-4 text-[#D99A42] shrink-0" />
                  <span>Enterprise Contractor Base</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#D9E3DE]">
                  <Wrench className="w-4 h-4 text-[#D99A42] shrink-0" />
                  <span>Zero Listing Fees</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Link
                href="/dashboard/owner/add"
                className="px-6 py-3.5 bg-[#D99A42] hover:bg-[#C48733] text-[#11231D] font-bold text-sm rounded-xs text-center transition-colors shadow-md inline-flex items-center justify-center gap-2"
              >
                <span>List Your Equipment</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/#how-it-works"
                className="px-6 py-3.5 bg-transparent border border-[#2E5848] hover:bg-[#1A382F] text-white font-semibold text-sm rounded-xs text-center transition-colors inline-flex items-center justify-center"
              >
                <span>Read Owner Guidelines</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
