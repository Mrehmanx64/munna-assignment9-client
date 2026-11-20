"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  X,
  Calendar,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  FileText,
  AlertCircle,
  Truck,
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

  // Pricing calculations
  const baseRentalSubtotal = equipment.rentalPrice * diffDays * quantity;
  const damageWaiver = Math.round(baseRentalSubtotal * 0.08); // 8% standard damage waiver
  const deliveryMobilizationFee = 150;
  const totalAmount = baseRentalSubtotal + damageWaiver + deliveryMobilizationFee;

  const handleSubmit = (e: React.FormEvent) => {
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

    setTimeout(() => {
      addBooking({
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
        durationText: `${diffDays} Day${diffDays > 1 ? "s" : ""}`,
        quantity,
        unitPrice: equipment.rentalPrice,
        rentalType: equipment.rentalType,
        totalAmount,
        paymentStatus: "paid",
        bookingStatus: "confirmed",
        deliveryAddress,
        notes,
      });

      setIsSubmitting(false);
      onClose();
      router.push("/dashboard/customer");
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-sm border border-[#DCDBCF] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#183C32] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#D99A42]" />
            <h2 className="font-heading text-lg font-bold">
              Reserve Equipment &amp; Schedule Dispatch
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xs hover:bg-[#245344] text-[#E5ECE8] transition-colors"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Equipment Summary Banner */}
          <div className="p-3.5 bg-[#F7F6F1] border border-[#E5E4DC] rounded-xs flex items-center gap-4">
            <div className="relative w-16 h-12 rounded-xs overflow-hidden bg-[#EBEAE3] shrink-0 border border-[#DCDBCF]">
              <Image
                src={equipment.images[0]}
                alt={equipment.title}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-sm font-bold text-[#183C32] truncate">
                {equipment.title}
              </h3>
              <p className="text-xs text-[#6A726B]">
                {equipment.brand} • ${equipment.rentalPrice}/{equipment.rentalType} • {equipment.location}
              </p>
            </div>
          </div>

          {/* Dates & Quantity Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="booking-start-date" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                Start Date
              </label>
              <input
                id="booking-start-date"
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32]"
              />
            </div>

            <div>
              <label htmlFor="booking-end-date" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                End Date
              </label>
              <input
                id="booking-end-date"
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32]"
              />
            </div>

            <div>
              <label htmlFor="booking-quantity" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                Quantity (Max {equipment.availableQuantity})
              </label>
              <input
                id="booking-quantity"
                type="number"
                min="1"
                max={equipment.availableQuantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.min(equipment.availableQuantity, Math.max(1, Number(e.target.value))))}
                className="w-full px-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32]"
              />
            </div>
          </div>

          {/* Contact & Delivery Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="booking-phone" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                Jobsite Phone Number
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
              <span>Rental Period ({diffDays} Days × {quantity} Unit{quantity > 1 ? "s" : ""}):</span>
              <span className="font-semibold text-[#202824]">${baseRentalSubtotal}</span>
            </div>
            <div className="flex justify-between text-[#555E57]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2E6B4F]" />
                Standard Damage Waiver (8%):
              </span>
              <span className="font-semibold text-[#202824]">${damageWaiver}</span>
            </div>
            <div className="flex justify-between text-[#555E57]">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#D99A42]" />
                Jobsite Drop-off &amp; Mobilization:
              </span>
              <span className="font-semibold text-[#202824]">${deliveryMobilizationFee}</span>
            </div>
            <div className="pt-2 border-t border-[#DCDBCF] flex justify-between items-baseline">
              <span className="font-bold text-[#183C32] text-sm">Total Escrow Amount:</span>
              <span className="font-heading font-extrabold text-[#183C32] text-lg">
                ${totalAmount}
              </span>
            </div>
          </div>

          {/* Legal / Policy Note */}
          <div className="flex items-start gap-2 text-[11px] text-[#6A726B]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B4F] shrink-0 mt-0.5" />
            <span>
              By clicking Confirm, you accept the Standard Master Equipment Lease Agreement. Payment is held in secure contractor escrow until delivery inspection.
            </span>
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-xs font-semibold text-[#4A544E] hover:bg-[#EBEAE3] rounded-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#183C32] hover:bg-[#245344] text-[#F7F6F1] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <FileText className="w-4 h-4 text-[#D99A42]" />
              <span>{isSubmitting ? "Locking Booking..." : "Confirm & Place Booking"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
