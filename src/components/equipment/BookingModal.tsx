"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  X,
  Calendar,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  CreditCard,
  Loader2,
  Info,
} from "lucide-react";
import { Equipment } from "@/types";
import { useApp } from "@/context/AppContext";
import { equipmentApi } from "@/lib/api";

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
  fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);

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

  // Live Availability & Schedule State
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availability, setAvailability] = useState<{
    isAvailable: boolean;
    availableQuantity: number;
    totalQuantity: number;
    bookedQuantity: number;
    bookedSchedules?: Array<{
      startDate: string;
      endDate: string;
      quantity: number;
      bookingStatus: string;
    }>;
  } | null>(null);
  const [scheduleOverlapWarning, setScheduleOverlapWarning] = useState<string | null>(null);

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

  // Real-time server-side availability checking based on dates, quantity and equipment schedules
  useEffect(() => {
    let isCurrent = true;
    if (!startDate || !endDate || end < start) {
      setAvailability(null);
      setScheduleOverlapWarning(null);
      return;
    }

    setCheckingAvailability(true);
    const qty = Math.max(1, Number(quantity) || 1);

    const timer = setTimeout(() => {
      equipmentApi
        .checkAvailability(equipment.id, {
          startDate,
          endDate,
          quantity: qty,
        })
        .then((data) => {
          if (!isCurrent) return;
          setAvailability(data);

          // Check if user selected dates conflict with existing active/confirmed bookings
          if (data && data.bookedSchedules && data.bookedSchedules.length > 0) {
            const reqStart = new Date(startDate);
            const reqEnd = new Date(endDate);
            const conflicting = data.bookedSchedules.find((s: any) => {
              const bStart = new Date(s.startDate);
              const bEnd = new Date(s.endDate);
              return reqStart <= bEnd && reqEnd >= bStart;
            });

            if (conflicting && !data.isAvailable) {
              setScheduleOverlapWarning(
                `Schedule Conflict: Already reserved from ${new Date(
                  conflicting.startDate
                ).toLocaleDateString("en-US", { month: "short", day: "numeric" })} to ${new Date(
                  conflicting.endDate
                ).toLocaleDateString("en-US", { month: "short", day: "numeric" })} (${conflicting.quantity} unit${
                  conflicting.quantity > 1 ? "s" : ""
                }). Only ${data.availableQuantity} of ${data.totalQuantity} unit(s) free.`
              );
            } else {
              setScheduleOverlapWarning(null);
            }
          } else {
            setScheduleOverlapWarning(null);
          }
        })
        .catch(() => {
          if (!isCurrent) return;
          setAvailability(null);
          setScheduleOverlapWarning(null);
        })
        .finally(() => {
          if (isCurrent) setCheckingAvailability(false);
        });
    }, 200);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [equipment.id, startDate, endDate, quantity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (end < start) {
      setError("Demobilization (end) date cannot be earlier than mobilization (start) date.");
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

    if (availability && !availability.isAvailable) {
      setError(
        `Equipment is unavailable for the selected dates. Only ${availability.availableQuantity} unit(s) available, but you requested ${quantity}. Please adjust dates or reduce quantity.`
      );
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
        customerPhone: phone.trim() || "+1 (555) 234-5678",
        ownerId: equipment.ownerId,
        ownerName: equipment.ownerName,
        startDate,
        endDate,
        durationText: `${duration} ${equipment.rentalType || "Day"}${duration > 1 ? "s" : ""}`,
        quantity: Math.max(1, Number(quantity) || 1),
        unitPrice: equipment.rentalPrice,
        rentalType: equipment.rentalType,
        totalAmount: estimatedTotal,
        paymentStatus: "pending",
        bookingStatus: "pending",
        deliveryAddress: deliveryAddress.trim() || "Pier 70 Redevelopment Site, San Francisco, CA",
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
      const msg = err.message || "Failed to initialize booking with server. Please try again.";
      if (
        msg.toLowerCase().includes("availability") ||
        msg.toLowerCase().includes("insufficient") ||
        msg.toLowerCase().includes("conflict")
      ) {
        setError(
          `Schedule Conflict: This machinery was just booked by another contractor for overlapping dates. Please review the live schedule hints below and choose alternative dates.`
        );
        // Refresh availability schedule immediately
        equipmentApi
          .checkAvailability(equipment.id, { startDate, endDate, quantity })
          .then(setAvailability)
          .catch(() => {});
      } else {
        setError(msg);
      }
      setIsSubmitting(false);
    }
  };

  const isUnavailable = availability !== null && !availability.isAvailable;

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
              <span>&bull;</span>
              <span className="font-semibold text-[#183C32]">
                ${equipment.rentalPrice}/{equipment.rentalType}
              </span>
              <span>&bull;</span>
              <span className="text-[#2E6B4F] font-semibold">
                Fleet Stock: {equipment.totalQuantity || equipment.availableQuantity} units
              </span>
            </div>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold block">Booking Notice</span>
                <span>{error}</span>
              </div>
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
                max={Math.max(1, equipment.totalQuantity || equipment.availableQuantity)}
                required
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32]"
              />
            </div>
          </div>

          {/* Real-Time Live Availability Feedback Badge */}
          {checkingAvailability && (
            <div className="p-2.5 bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs flex items-center gap-2 text-xs text-[#6A726B]">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#183C32]" />
              <span>Checking real-time fleet schedules and yard stock availability...</span>
            </div>
          )}

          {!checkingAvailability && availability && (
            <div>
              {availability.isAvailable ? (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xs flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Available for Selected Dates:</strong> {availability.availableQuantity} of{" "}
                      {availability.totalQuantity} unit(s) currently ready.
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-xs">
                    In Stock
                  </span>
                </div>
              ) : (
                <div className="p-3 bg-red-50 border border-red-300 text-red-800 rounded-xs space-y-1 text-xs">
                  <div className="flex items-center gap-2 font-bold text-red-900">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>
                      {availability.availableQuantity === 0
                        ? "Unavailable for Selected Dates (0 units in stock)"
                        : `Stock Limit: Only ${availability.availableQuantity} unit(s) available`}
                    </span>
                  </div>
                  <p className="text-[11px] text-red-700 leading-relaxed">
                    {scheduleOverlapWarning ||
                      `All ${availability.totalQuantity} units are reserved during this schedule window. Please choose alternative dates or reduce requested quantity.`}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Reserved Dates & Schedule Hint Box */}
          {availability?.bookedSchedules && availability.bookedSchedules.length > 0 && (
            <div className="p-3 bg-[#FAF9F5] border border-[#E5E4DC] rounded-xs text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#183C32] flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-[#D99A42]" />
                  Active Reservations for this Machinery
                </span>
                <span className="text-[10px] text-[#6A726B] font-semibold bg-[#EBEAE3] px-2 py-0.5 rounded-xs">
                  {availability.bookedSchedules.length} Scheduled
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {availability.bookedSchedules.map((s, idx) => {
                  const sStart = new Date(s.startDate);
                  const sEnd = new Date(s.endDate);
                  const reqStart = new Date(startDate);
                  const reqEnd = new Date(endDate);
                  const isConflicting = reqStart <= sEnd && reqEnd >= sStart;

                  return (
                    <div
                      key={idx}
                      className={`px-2.5 py-1 rounded-xs text-[11px] flex items-center gap-1.5 border transition-colors ${
                        isConflicting
                          ? "bg-red-50 border-red-300 text-red-800 font-bold"
                          : "bg-white border-[#E0DFD6] text-[#525B55]"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isConflicting ? "bg-red-500" : "bg-amber-500"
                        }`}
                      />
                      <span>
                        {sStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} &ndash;{" "}
                        {sEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      <span className="text-[10px] opacity-75">
                        ({s.quantity} {s.quantity > 1 ? "units" : "unit"})
                      </span>
                      {isConflicting && (
                        <span className="text-[9px] uppercase tracking-wider text-red-700 bg-red-100 px-1 py-0.2 rounded-xs">
                          Conflict
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-[#8A948D] flex items-center gap-1">
                <Info className="w-3 h-3 text-[#D99A42] shrink-0" />
                <span>
                  Tip: Choose mobilization and demobilization dates outside the red/amber schedule slots.
                </span>
              </p>
            </div>
          )}

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
              <span>Rental Period ({duration} {equipment.rentalType || "Day"}{duration > 1 ? "s" : ""} &times; {quantity} Unit{quantity > 1 ? "s" : ""}):</span>
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
              disabled={isSubmitting || isUnavailable}
              className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-xs flex items-center gap-2 cursor-pointer ${
                isUnavailable
                  ? "bg-[#6A726B] text-[#DCDBCF] cursor-not-allowed opacity-80"
                  : "bg-[#183C32] hover:bg-[#245344] text-[#F7F6F1]"
              }`}
            >
              <CreditCard className="w-4 h-4 text-[#D99A42]" />
              <span>
                {isSubmitting
                  ? "Connecting to Stripe..."
                  : isUnavailable
                  ? "Unavailable for Selected Dates"
                  : "Proceed to Stripe Checkout"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
