"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  X,
  Calendar,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { Equipment } from "@/types";
import { useApp } from "@/context/AppContext";

interface BookingModalProps {
  equipment: Equipment;
  onClose: () => void;
}

export function BookingModal({ equipment, onClose }: BookingModalProps) {
  const router = useRouter();
  const { currentUser, addBooking } = useApp();

  // Form State
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const fiveDaysLater = new Date();
  fiveDaysLater.setDate(fiveDaysLater.getDate() + 6);

  const [startDate, setStartDate] = useState(tomorrow.toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(fiveDaysLater.toISOString().split("T")[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [phone, setPhone] = useState(currentUser?.phone || "+1 (555) 234-5678");
  const [deliveryAddress, setDeliveryAddress] = useState(
    currentUser?.address || "Pier 70 Redevelopment Site, San Francisco, CA"
  );
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compute duration in days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Estimated pricing calculation for preview (server is authoritative)
  let duration: number;
  const rentalType = (equipment.rentalType || "daily").toLowerCase();
  switch (rentalType) {
    case "weekly":
      duration = Math.max(1, Math.ceil(diffDays / 7));
      break;
    case "monthly":
      duration = Math.max(1, Math.ceil(diffDays / 30));
      break;
    case "daily":
    default:
      duration = diffDays;
      break;
  }
  const estimatedTotal = equipment.rentalPrice * duration * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (diffDays < 1) {
      setError("End date must be after the start date.");
      return;
    }

    if (!deliveryAddress.trim()) {
      setError("Please provide a valid jobsite delivery address.");
      return;
    }

    if (!phone.trim()) {
      setError("Please provide a contact phone number for field dispatch.");
      return;
    }

    setIsSubmitting(true);

    try {
      const checkoutUrl = await addBooking({
        equipmentId: equipment.id,
        equipmentTitle: equipment.title,
        equipmentImage: equipment.images[0],
        equipmentCategory: equipment.category,
        customerId: currentUser?.id || "usr-cust-1",
        customerName: currentUser?.name || "Contractor Customer",
        customerEmail: currentUser?.email || "contractor@apexbuild.com",
        customerPhone: phone,
        ownerId: equipment.ownerId,
        ownerName: equipment.ownerName,
        startDate,
        endDate,
        durationText: `${duration} ${equipment.rentalType || "Day"}${duration > 1 ? "s" : ""}`,
        quantity,
        unitPrice: equipment.rentalPrice,
        rentalType: equipment.rentalType,
        totalAmount: estimatedTotal,
        paymentStatus: "pending",
        bookingStatus: "pending",
        deliveryAddress,
        notes,
      });

      if (checkoutUrl) {
        // Redirect directly to Stripe Checkout
        window.location.href = checkoutUrl;
      } else {
        onClose();
        router.push("/dashboard/customer");
      }
    } catch (err: any) {
      setError(err.message || "Failed to initialize booking with server. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-sm border border-[#DCDBCF] shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-[#183C32] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#D99A42]" />
            <h3 className="font-heading text-lg font-bold">
              Reserve Equipment &amp; Stripe Escrow
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/70 hover:text-white rounded-xs transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Equipment Snapshot */}
        <div className="p-4 bg-[#F7F6F1] border-b border-[#E5E4DC] flex items-center gap-4">
          <div className="relative w-20 h-16 rounded-xs overflow-hidden shrink-0 border border-[#DCDBCF]">
            <Image
              src={equipment.images[0]}
              alt={equipment.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D99A42]">
              {equipment.category}
            </span>
            <h4 className="font-heading text-sm font-bold text-[#183C32] truncate">
              {equipment.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-[#6A726B] mt-0.5">
              <span>{equipment.brand} {equipment.model}</span>
              <span>•</span>
              <span className="font-semibold text-[#183C32]">
                ${equipment.rentalPrice}/{equipment.rentalType}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Dates & Quantity Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="booking-start-date" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                Mobilization (Start)
              </label>
              <input
                id="booking-start-date"
                type="date"
                required
                value={startDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32]"
              />
            </div>

            <div>
              <label htmlFor="booking-end-date" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                Demobilization (End)
              </label>
              <input
                id="booking-end-date"
                type="date"
                required
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32]"
              />
            </div>

            <div>
              <label htmlFor="booking-quantity" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                Quantity Units
              </label>
              <input
                id="booking-quantity"
                type="number"
                min={1}
                max={Math.max(1, equipment.availableQuantity)}
                required
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32]"
              />
            </div>
          </div>

          {/* Dispatch Contact & Jobsite Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="booking-phone" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                Field Superintendent Contact
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-[#8A948D] absolute left-2.5 top-2.5" />
                <input
                  id="booking-phone"
                  type="text"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="booking-address" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                Delivery Site Address
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-[#8A948D] absolute left-2.5 top-2.5" />
                <input
                  id="booking-address"
                  type="text"
                  required
                  placeholder="Street, City, Zip"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32]"
                />
              </div>
            </div>
          </div>

          {/* Additional Project Notes */}
          <div>
            <label htmlFor="booking-notes" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
              Dispatch Instructions / Site Gate Code
            </label>
            <textarea
              id="booking-notes"
              rows={2}
              placeholder="e.g. Please deliver before 7:00 AM. Enter via North staging gate. Bring 3-phase camlock cables."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32]"
            />
          </div>

          {/* Pricing Calculation Summary Table */}
          <div className="p-4 bg-[#F7F6F1] border border-[#E5E4DC] rounded-xs space-y-2 text-xs">
            <div className="flex justify-between text-[#555E57]">
              <span>Rental Period ({duration} {equipment.rentalType || "Day"}{duration > 1 ? "s" : ""} × {quantity} Unit{quantity > 1 ? "s" : ""}):</span>
              <span className="font-semibold text-[#202824]">${estimatedTotal}</span>
            </div>
            <div className="pt-2 border-t border-[#DCDBCF] flex justify-between items-baseline">
              <span className="font-bold text-[#183C32] text-sm">Estimated Total Amount:</span>
              <span className="font-heading font-extrabold text-[#183C32] text-lg">
                ${estimatedTotal}
              </span>
            </div>
            <p className="text-[10px] text-[#8A948D]">
              * Final authoritative billing duration and pricing are verified server-side.
            </p>
          </div>

          {/* Legal / Policy Note */}
          <div className="flex items-start gap-2 text-[11px] text-[#6A726B]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B4F] shrink-0 mt-0.5" />
            <span>
              By proceeding, you initialize a verified Stripe Checkout session. Funds are held in escrow until rental completion.
            </span>
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-xs font-semibold text-[#4A544E] hover:bg-[#EBEAE3] rounded-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#183C32] hover:bg-[#245344] text-[#F7F6F1] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4 text-[#D99A42]" />
              <span>{isSubmitting ? "Connecting to Stripe..." : "Proceed to Stripe Checkout"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
