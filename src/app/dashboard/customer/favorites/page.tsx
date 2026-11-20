"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  Trash2,
  ArrowRight,
  MapPin,
  Star,
  CheckCircle2,
  PackageOpen,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function CustomerFavoritesPage() {
  const { favorites, toggleFavorite, equipmentList } = useApp();

  const savedEquipment = equipmentList.filter((eq) => favorites.includes(eq.id));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D99A42]">
            <Bookmark className="w-3.5 h-3.5 fill-[#D99A42]" />
            <span>Saved Equipment</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#183C32]">
            My Saved Machinery &amp; Gear
          </h1>
          <p className="text-xs sm:text-sm text-[#6A726B] mt-0.5">
            Quickly monitor availability and rates for your preferred equipment fleet.
          </p>
        </div>

        <Link
          href="/equipment"
          className="px-4 py-2 bg-white hover:bg-[#EBEAE3] text-[#183C32] border border-[#DCDBCF] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-2xs inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <span>Find More Machinery</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid of Saved Items */}
      {savedEquipment.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedEquipment.map((equipment) => (
            <div
              key={equipment.id}
              className="bg-white rounded-sm border border-[#E5E4DC] hover:border-[#183C32] transition-colors shadow-2xs overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-[#EBEAE3]">
                  <Image
                    src={equipment.images[0]}
                    alt={equipment.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#183C32] text-white rounded-xs">
                      {equipment.category.split(" ")[0]}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleFavorite(equipment.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 text-red-600 hover:bg-white shadow-xs transition-colors"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#6A726B]">
                    <span className="font-bold text-[#183C32] uppercase">{equipment.brand}</span>
                    <div className="flex items-center gap-1 text-[#202824] font-medium">
                      <Star className="w-3.5 h-3.5 fill-[#D99A42] text-[#D99A42]" />
                      <span>{equipment.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <Link href={`/equipment/${equipment.id}`}>
                    <h3 className="font-heading text-sm font-bold text-[#183C32] hover:underline line-clamp-1">
                      {equipment.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1.5 text-xs text-[#6A726B]">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-[#8A948D]" />
                    <span className="truncate">{equipment.location}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-[#2E6B4F] font-semibold pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{equipment.availableQuantity} units ready for delivery</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 pt-3 border-t border-[#ECEBE3] bg-[#F7F6F1] flex items-center justify-between">
                <div>
                  <span className="font-heading text-base font-extrabold text-[#183C32]">
                    ${equipment.rentalPrice}
                  </span>
                  <span className="text-xs text-[#6A726B]">/{equipment.rentalType}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFavorite(equipment.id)}
                    className="px-2.5 py-1.5 text-xs text-[#8A948D] hover:text-red-700 font-semibold"
                  >
                    Remove
                  </button>
                  <Link
                    href={`/equipment/${equipment.id}`}
                    className="px-3.5 py-1.5 bg-[#183C32] hover:bg-[#245344] text-white text-xs font-semibold rounded-xs shadow-2xs transition-colors"
                  >
                    Rent Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white p-12 rounded-sm border border-[#E5E4DC] text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#EBEAE3] text-[#6A726B] flex items-center justify-center mx-auto">
            <PackageOpen className="w-7 h-7" />
          </div>
          <h3 className="font-heading text-lg font-bold text-[#183C32]">
            No saved equipment yet
          </h3>
          <p className="text-xs sm:text-sm text-[#6A726B] max-w-md mx-auto">
            Click the bookmark icon on any equipment card across the marketplace to save machinery for upcoming projects.
          </p>
          <Link
            href="/equipment"
            className="px-4 py-2 bg-[#183C32] hover:bg-[#245344] text-white text-xs font-semibold rounded-xs transition-colors shadow-2xs inline-block"
          >
            Explore Equipment Catalog
          </Link>
        </div>
      )}
    </div>
  );
}
