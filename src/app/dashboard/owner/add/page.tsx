"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  Wrench,
  AlertCircle,
  Image as ImageIcon,
  DollarSign,
  FileText,
  MapPin,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { EquipmentCategory, EquipmentCondition, RentalType } from "@/types";

export default function AddEquipmentPage() {
  const router = useRouter();
  const { addEquipment, currentUser } = useApp();

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<EquipmentCategory>("Construction Equipment");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [location, setLocation] = useState("Oakland Yard, CA");
  const [rentalPrice, setRentalPrice] = useState<number>(450);
  const [rentalType, setRentalType] = useState<RentalType>("daily");
  const [quantity, setQuantity] = useState<number>(2);
  const [condition, setCondition] = useState<EquipmentCondition>("Excellent");
  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1768085091650-e8e89ef57b76?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
  );
  const [termsText, setTermsText] = useState(
    "Commercial contractor license required.\nDaily maintenance log must be signed.\nFuel replacement policy applies."
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories: EquipmentCategory[] = [
    "Construction Equipment",
    "Photography Equipment",
    "Vehicles & Transportation",
    "Agriculture Equipment",
    "Electronics",
    "Event Equipment",
  ];

  const conditions: EquipmentCondition[] = [
    "Like New",
    "Excellent",
    "Good",
    "Fair",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !brand.trim() || !model.trim() || !description.trim()) {
      setError("Please fill out all essential equipment details.");
      return;
    }

    if (rentalPrice <= 0) {
      setError("Please set a valid rental price greater than $0.");
      return;
    }

    setIsSubmitting(true);

    const parsedTerms = termsText
      .split("\n")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    setTimeout(() => {
      addEquipment({
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description,
        category,
        rentalPrice,
        rentalType,
        availableQuantity: quantity,
        totalQuantity: quantity,
        condition,
        brand,
        model,
        location,
        images: [imageUrl],
        ownerId: currentUser?.id || "usr-owner-1",
        ownerName: currentUser?.name || "Marcus Vance",
        ownerAvatar:
          currentUser?.avatarUrl ||
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        ownerVerified: true,
        terms: parsedTerms.length > 0 ? parsedTerms : ["Standard lease agreement applies."],
        specifications: [
          { label: "Manufacturer Brand", value: brand },
          { label: "Model Series", value: model },
          { label: "Condition Rating", value: condition },
          { label: "Yard Base", value: location },
        ],
        status: "active",
      });

      setIsSubmitting(false);
      router.push("/dashboard/owner/equipment");
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D99A42]">
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Fleet Listing</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#183C32]">
          List Machinery for Rental
        </h1>
        <p className="text-xs sm:text-sm text-[#6A726B] mt-0.5">
          Submit verified heavy equipment, cinema optics, or commercial vehicles to the Rentora marketplace.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-sm border border-[#E5E4DC] shadow-2xs space-y-6">
        {/* Section 1: Basic Identifiers */}
        <div className="space-y-4">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[#183C32] border-b border-[#ECEBE3] pb-2 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#D99A42]" />
            <span>1. Equipment Identifiers &amp; Classification</span>
          </h2>

          <div>
            <label htmlFor="eq-title" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
              Equipment Title *
            </label>
            <input
              id="eq-title"
              type="text"
              required
              placeholder="e.g. Komatsu PC210LC-11 Hydraulic Excavator"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32] focus:bg-white font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="eq-category" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                Category *
              </label>
              <select
                id="eq-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as EquipmentCategory)}
                className="w-full px-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32] focus:bg-white cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="eq-brand" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                Brand / Manufacturer *
              </label>
              <input
                id="eq-brand"
                type="text"
                required
                placeholder="e.g. Caterpillar, ARRI"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32] focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="eq-model" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                Model Series *
              </label>
              <input
                id="eq-model"
                type="text"
                required
                placeholder="e.g. 320 GC Tier 4"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Pricing, Stock & Yard Base */}
        <div className="space-y-4 pt-2">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[#183C32] border-b border-[#ECEBE3] pb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#D99A42]" />
            <span>2. Rental Pricing &amp; Fleet Logistics</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label htmlFor="eq-price" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                Rental Rate ($ USD) *
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-[#8A948D] absolute left-2.5 top-2.5" />
                <input
                  id="eq-price"
                  type="number"
                  min="1"
                  required
                  value={rentalPrice}
                  onChange={(e) => setRentalPrice(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] font-bold focus:outline-hidden focus:border-[#183C32] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="eq-rental-type" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                Billing Cycle
              </label>
              <select
                id="eq-rental-type"
                value={rentalType}
                onChange={(e) => setRentalType(e.target.value as RentalType)}
                className="w-full px-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32] focus:bg-white cursor-pointer"
              >
                <option value="daily">Per Day</option>
                <option value="weekly">Per Week</option>
                <option value="monthly">Per Month</option>
                <option value="hourly">Per Hour</option>
              </select>
            </div>

            <div>
              <label htmlFor="eq-quantity" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                Available Fleet Units
              </label>
              <input
                id="eq-quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32] focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="eq-condition" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                Physical Condition
              </label>
              <select
                id="eq-condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value as EquipmentCondition)}
                className="w-full px-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32] focus:bg-white cursor-pointer"
              >
                {conditions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="eq-location" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
              Yard Storage Base / Drop-off Hub *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#8A948D] absolute left-3 top-2.5" />
              <input
                id="eq-location"
                type="text"
                required
                placeholder="e.g. 1850 Industrial Parkway, Oakland Yard, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Photography & Image Preview */}
        <div className="space-y-4 pt-2">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[#183C32] border-b border-[#ECEBE3] pb-2 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#D99A42]" />
            <span>3. Machinery Photography &amp; Visual Preview</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-8">
              <label htmlFor="eq-image-url" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                Primary High-Resolution Image URL *
              </label>
              <input
                id="eq-image-url"
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32] focus:bg-white"
              />
              <span className="text-[10px] text-[#8A948D] mt-1 block">
                Provide a crisp, clear photo of the actual equipment in operation or depot yard.
              </span>
            </div>

            {/* Live Image Preview Thumbnail */}
            <div className="sm:col-span-4 flex justify-center">
              <div className="relative aspect-16/10 w-44 rounded-xs overflow-hidden border-2 border-[#183C32] bg-[#EAE8DE] shadow-xs">
                <Image
                  src={imageUrl}
                  alt="Preview"
                  fill
                  sizes="180px"
                  className="object-cover"
                />
                <div className="absolute bottom-1 right-1 bg-[#183C32]/90 text-white text-[9px] px-1.5 py-0.5 rounded-2xs font-mono">
                  Live Preview
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Specifications & Terms */}
        <div className="space-y-4 pt-2">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[#183C32] border-b border-[#ECEBE3] pb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#D99A42]" />
            <span>4. Operational Overview &amp; Rental Terms</span>
          </h2>

          <div>
            <label htmlFor="eq-desc" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
              Technical Description &amp; Capabilities *
            </label>
            <textarea
              id="eq-desc"
              rows={3}
              required
              placeholder="Describe operating capacity, hydraulics, engine output, attachments, and recommended project applications..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32] focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="eq-terms" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
              Rental Conditions &amp; Mandatory Qualifications (One per line)
            </label>
            <textarea
              id="eq-terms"
              rows={3}
              value={termsText}
              onChange={(e) => setTermsText(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32] focus:bg-white"
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div className="pt-4 border-t border-[#ECEBE3] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/owner/equipment")}
            className="px-4 py-2 text-xs font-semibold text-[#4A544E] hover:bg-[#EBEAE3] rounded-xs transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#183C32] hover:bg-[#245344] text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4 text-[#D99A42]" />
            <span>{isSubmitting ? "Publishing to Fleet..." : "Publish Fleet Listing"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
