"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Bookmark,
  Star,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Equipment } from "@/types";
import { useApp } from "@/context/AppContext";

interface EquipmentCardProps {
  equipment: Equipment;
  priority?: boolean;
}

export function EquipmentCard({ equipment, priority = false }: EquipmentCardProps) {
  const { currentUser, currentRole, isFavorite, toggleFavorite } = useApp();
  const favorited = isFavorite(equipment.id);

  // If user is not logged in, redirect to login with return URL; otherwise redirect directly to details
  const detailsHref =
    currentUser && currentRole !== "guest"
      ? `/equipment/${equipment.id}`
      : `/login?redirect=${encodeURIComponent(`/equipment/${equipment.id}`)}`;

  return (
    <div className="group bg-white rounded-sm border border-[#E5E4DC] hover:border-[#183C32] transition-all duration-300 shadow-2xs hover:shadow-md flex flex-col overflow-hidden">
      {/* Image Area with Aspect Ratio */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-[#ECEAE2]">
        <Image
          src={equipment.images[0] || "https://images.unsplash.com/photo-1768085091650-e8e89ef57b76?q=80&w=1171&auto=format&fit=crop"}
          alt={equipment.title}
          fill
          priority={priority}
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-[#183C32]/90 text-white backdrop-blur-xs rounded-xs pointer-events-auto">
            {equipment.category.split(" ")[0]}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(equipment.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all pointer-events-auto shadow-xs ${
              favorited
                ? "bg-[#D99A42] text-white"
                : "bg-white/90 text-[#202824] hover:bg-white hover:text-[#183C32]"
            }`}
            aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
          >
            <Bookmark className={`w-4 h-4 ${favorited ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Condition & Stock Floating Tag */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 pointer-events-none">
          <span className="px-2 py-0.5 text-[10px] font-semibold bg-white/95 text-[#202824] backdrop-blur-xs rounded-xs border border-[#DCDBCF] shadow-2xs">
            {equipment.condition}
          </span>
          <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#183C32]/95 text-[#F7F6F1] backdrop-blur-xs rounded-xs flex items-center gap-1 shadow-2xs">
            <CheckCircle2 className="w-2.5 h-2.5 text-[#D99A42]" />
            {equipment.availableQuantity} in stock
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Brand & Model and Rating */}
          <div className="flex items-center justify-between text-xs text-[#6A726B] mb-1">
            <span className="font-semibold uppercase tracking-wider text-[#183C32]">
              {equipment.brand}
            </span>
            <div className="flex items-center gap-1 text-[#202824] font-medium">
              <Star className="w-3.5 h-3.5 fill-[#D99A42] text-[#D99A42]" />
              <span>{equipment.rating.toFixed(1)}</span>
              <span className="text-[#8A948D]">({equipment.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link href={detailsHref} className="focus:outline-hidden">
            <h3 className="font-heading text-base font-bold text-[#202824] group-hover:text-[#183C32] transition-colors line-clamp-1">
              {equipment.title}
            </h3>
          </Link>

          {/* Location & Owner info */}
          <div className="mt-2 flex items-center justify-between text-xs text-[#6A726B]">
            <div className="flex items-center gap-1 truncate max-w-[65%]">
              <MapPin className="w-3.5 h-3.5 text-[#8A948D] shrink-0" />
              <span className="truncate">{equipment.location}</span>
            </div>
            {equipment.ownerVerified && (
              <span className="flex items-center gap-1 text-[11px] text-[#2E6B4F] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2E6B4F]" /> Verified
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA Footer */}
        <div className="pt-3 border-t border-[#ECEBE3] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-lg font-extrabold text-[#183C32]">
                ${equipment.rentalPrice}
              </span>
              <span className="text-xs text-[#6A726B] font-medium">
                /{equipment.rentalType}
              </span>
            </div>
            <span className="text-[10px] text-[#8A948D] block">Excl. local taxes</span>
          </div>

          <Link
            href={detailsHref}
            className="px-3.5 py-1.5 bg-[#EBEAE3] hover:bg-[#183C32] text-[#183C32] hover:text-[#F7F6F1] text-xs font-semibold rounded-xs transition-colors inline-flex items-center gap-1.5"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
