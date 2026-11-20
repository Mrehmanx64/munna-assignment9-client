"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  MapPin,
  Star,
  ShieldCheck,
  Bookmark,
  Calendar,
  CheckCircle2,
  Phone,
  Mail,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  PackageOpen,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { EquipmentGallery } from "@/components/equipment/EquipmentGallery";
import { EquipmentCard } from "@/components/equipment/EquipmentCard";
import { BookingModal } from "@/components/equipment/BookingModal";
import { useApp } from "@/context/AppContext";
import { equipmentApi } from "@/lib/api";
import { toast } from "sonner";

export default function EquipmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { currentUser, currentRole, equipmentList, isFavorite, toggleFavorite } = useApp();

  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // Fetch real equipment from backend API via TanStack Query
  const { data: serverEquipment, isLoading } = useQuery({
    queryKey: ["equipmentDetails", id],
    queryFn: () => equipmentApi.getById(id),
    enabled: !!id,
    staleTime: 60000,
  });

  const equipment =
    serverEquipment && serverEquipment.id
      ? serverEquipment
      : equipmentList.find((e) => e.id === id) || equipmentList[0];

  const favorited = isFavorite(equipment?.id);

  // Related equipment from same category (excluding current)
  const relatedEquipment = equipmentList
    .filter((e) => e.category === equipment?.category && e.id !== equipment?.id)
    .slice(0, 3);

  const handleBookClick = () => {
    if (!currentUser || currentRole === "guest") {
      toast.info("Please sign in with a contractor customer account to book machinery");
      router.push(`/login?redirect=/equipment/${id}`);
      return;
    }
    if (equipment.status !== "active") {
      toast.error("This equipment listing is currently pending administrative audit and cannot be booked.");
      return;
    }
    setBookingModalOpen(true);
  };

  const handleFavoriteClick = () => {
    if (!currentUser || currentRole === "guest") {
      toast.info("Please sign in to save equipment to your favorites");
      router.push(`/login?redirect=/equipment/${id}`);
      return;
    }
    toggleFavorite(equipment.id);
  };

  if (isLoading && !equipment) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F7F6F1]">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-20 w-full animate-pulse space-y-6">
          <div className="h-6 bg-[#EBEAE3] w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 h-96 bg-[#EBEAE3] rounded-xs" />
            <div className="lg:col-span-5 h-96 bg-[#EBEAE3] rounded-xs" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F7F6F1]">
        <Navbar />
        <div className="flex-1 max-w-xl mx-auto px-4 py-24 text-center space-y-4">
          <PackageOpen className="w-12 h-12 text-[#6A726B] mx-auto" />
          <h1 className="font-heading text-2xl font-bold text-[#183C32]">Equipment Not Found</h1>
          <p className="text-sm text-[#6A726B]">
            The requested machinery record does not exist or may have been unlisted by the owner.
          </p>
          <Link
            href="/equipment"
            className="inline-block px-5 py-2.5 bg-[#183C32] text-white text-xs font-semibold rounded-xs hover:bg-[#245344]"
          >
            Browse Equipment Catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F1]">
      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb Bar */}
        <div className="bg-[#EBEAE3] border-b border-[#DCDBCF] py-3.5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1.5 text-xs text-[#6A726B] overflow-x-auto whitespace-nowrap">
              <Link href="/" className="hover:text-[#183C32]">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <Link href="/equipment" className="hover:text-[#183C32]">Equipment Catalog</Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <Link
                href={`/equipment?category=${encodeURIComponent(equipment.category)}`}
                className="hover:text-[#183C32]"
              >
                {equipment.category}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[#183C32] font-semibold truncate max-w-[240px]">
                {equipment.title}
              </span>
            </div>
          </div>
        </div>

        {/* Audit Status Notice if unapproved */}
        {equipment.status !== "active" && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Listing Status ({equipment.status.toUpperCase()}):</strong> This machinery is currently undergoing quality and safety inspection. Bookings are temporarily paused until approved.
              </span>
            </div>
          </div>
        )}

        {/* Main Details Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Gallery & In-Depth Details (7 cols) */}
            <div className="lg:col-span-7 space-y-10">
              {/* Interactive Image Gallery */}
              <EquipmentGallery images={equipment.images} title={equipment.title} />

              {/* Description & Overview */}
              <div className="bg-white p-6 sm:p-8 rounded-sm border border-[#E5E4DC] shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D99A42]">
                  <FileText className="w-4 h-4" />
                  <span>Technical &amp; Operational Overview</span>
                </div>
                <h2 className="font-heading text-2xl font-bold text-[#183C32]">
                  About This Machinery
                </h2>
                <p className="text-sm text-[#4A544E] leading-relaxed">
                  {equipment.description}
                </p>
              </div>

              {/* Full Technical Specifications */}
              <div className="bg-white p-6 sm:p-8 rounded-sm border border-[#E5E4DC] shadow-2xs space-y-4">
                <h3 className="font-heading text-lg font-bold text-[#183C32] border-b border-[#ECEBE3] pb-3">
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {equipment.specifications && equipment.specifications.length > 0 ? (
                    equipment.specifications.map((spec, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-xs bg-[#F7F6F1] border border-[#ECEBE3] flex flex-col justify-center"
                      >
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#6A726B]">
                          {spec.label}
                        </span>
                        <span className="font-heading text-sm font-semibold text-[#183C32] mt-0.5">
                          {spec.value}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-[#6A726B] col-span-2">
                      Standard OEM specifications apply for {equipment.brand} {equipment.model}.
                    </div>
                  )}
                </div>
              </div>

              {/* Rental Terms and Conditions */}
              <div className="bg-white p-6 sm:p-8 rounded-sm border border-[#E5E4DC] shadow-2xs space-y-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#D99A42]" />
                  <h3 className="font-heading text-lg font-bold text-[#183C32]">
                    Contractual Terms &amp; Site Guidelines
                  </h3>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#555E57]">
                  {equipment.terms && equipment.terms.length > 0 ? (
                    equipment.terms.map((term, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#2E6B4F] shrink-0 mt-0.5" />
                        <span>{term}</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2E6B4F] shrink-0 mt-0.5" />
                      <span>Standard commercial contractor lease conditions apply.</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Right Column: Pricing, Booking Action & Owner Box (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Sticky Booking Action Card */}
              <div className="bg-white p-6 sm:p-8 rounded-sm border border-[#DCDBCF] shadow-md space-y-6 lg:sticky lg:top-28">
                {/* Header Tag & Rating */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-[#183C32] text-white rounded-xs">
                    {equipment.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-[#202824] font-semibold">
                    <Star className="w-4 h-4 fill-[#D99A42] text-[#D99A42]" />
                    <span>{equipment.rating.toFixed(2)}</span>
                    <span className="text-[#8A948D]">({equipment.reviewCount} reviews)</span>
                  </div>
                </div>

                {/* Title & Brand/Model */}
                <div>
                  <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#183C32] leading-tight">
                    {equipment.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#6A726B] mt-1">
                    {equipment.brand} • Model {equipment.model}
                  </p>
                </div>

                {/* Location & Availability Status */}
                <div className="space-y-2 pt-2 border-t border-[#ECEBE3] text-xs text-[#525B55]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#8A948D] shrink-0" />
                    <span>Yard Location: <strong>{equipment.location}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#8A948D] shrink-0" />
                    <span>Condition: <strong>{equipment.condition}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#2E6B4F] shrink-0" />
                    <span className="text-[#2E6B4F] font-semibold">
                      {equipment.availableQuantity} of {equipment.totalQuantity} units currently ready for mobilization
                    </span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-xs bg-[#F7F6F1] border border-[#E5E4DC]">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-[#6A726B] block">
                        Base Rate
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="font-heading text-3xl font-extrabold text-[#183C32]">
                          ${equipment.rentalPrice}
                        </span>
                        <span className="text-sm font-medium text-[#6A726B]">
                          /{equipment.rentalType}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-semibold text-[#2E6B4F] block">
                        Instant Booking Ready
                      </span>
                      <span className="text-[10px] text-[#8A948D]">
                        Escrow Protected
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA Action Buttons */}
                <div className="space-y-2.5">
                  <button
                    onClick={handleBookClick}
                    className="w-full py-3.5 bg-[#183C32] hover:bg-[#245344] text-[#F7F6F1] text-sm font-bold uppercase tracking-wider rounded-xs transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-[#D99A42]" />
                    <span>Book Equipment Now</span>
                  </button>

                  <button
                    onClick={handleFavoriteClick}
                    className={`w-full py-2.5 text-xs font-semibold rounded-xs border transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                      favorited
                        ? "bg-[#D99A42] text-white border-[#D99A42]"
                        : "bg-white text-[#183C32] border-[#DCDBCF] hover:bg-[#F7F6F1]"
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${favorited ? "fill-current" : ""}`} />
                    <span>{favorited ? "Saved in Your Favorites" : "Save to Favorites"}</span>
                  </button>
                </div>

                {/* Security Credentials */}
                <div className="pt-3 border-t border-[#ECEBE3] space-y-2 text-[11px] text-[#6A726B]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#D99A42] shrink-0" />
                    <span>Contractor Liability Protection Included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D99A42] shrink-0" />
                    <span>Free cancellation up to 48 hours before dispatch</span>
                  </div>
                </div>
              </div>

              {/* Owner Information Card */}
              <div className="bg-white p-6 rounded-sm border border-[#E5E4DC] shadow-2xs space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6A726B]">
                  Verified Equipment Owner
                </span>

                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-[#183C32]">
                    <Image
                      src={equipment.ownerAvatar}
                      alt={equipment.ownerName}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-heading text-base font-bold text-[#183C32]">
                        {equipment.ownerName}
                      </h4>
                      {equipment.ownerVerified && (
                        <ShieldCheck className="w-4 h-4 text-[#2E6B4F]" />
                      )}
                    </div>
                    <span className="text-xs text-[#6A726B]">
                      Authorized Machinery Supplier
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#ECEBE3] space-y-1.5 text-xs text-[#525B55]">
                  {equipment.ownerPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#8A948D]" />
                      <span>{equipment.ownerPhone}</span>
                    </div>
                  )}
                  {equipment.ownerEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#8A948D]" />
                      <span>{equipment.ownerEmail}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Equipment Section */}
          {relatedEquipment.length > 0 && (
            <div className="mt-20 pt-12 border-t border-[#E5E4DC] space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D99A42]">
                    Similar Machinery
                  </span>
                  <h3 className="font-heading text-2xl font-extrabold text-[#183C32]">
                    Related {equipment.category}
                  </h3>
                </div>
                <Link
                  href={`/equipment?category=${encodeURIComponent(equipment.category)}`}
                  className="text-xs font-bold text-[#183C32] hover:underline"
                >
                  View All in Category →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {relatedEquipment.map((rel) => (
                  <EquipmentCard key={rel.id} equipment={rel} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Booking Modal */}
      {bookingModalOpen && (
        <BookingModal
          equipment={equipment}
          onClose={() => setBookingModalOpen(false)}
        />
      )}

      <Footer />
    </div>
  );
}
