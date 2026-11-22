"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  CreditCard,
  PhoneCall,
  Calendar,
  Clock,
  HelpCircle,
  ShoppingBag,
  ArrowLeft,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { bookingApi } from "@/lib/api";
import { toast } from "sonner";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");
  const status = searchParams.get("status");
  const reasonParam = searchParams.get("reason");

  const [bookingData, setBookingData] = useState<any>(null);
  const [retrying, setRetrying] = useState(false);
  const [loadingBooking, setLoadingBooking] = useState(false);

  useEffect(() => {
    if (bookingId) {
      setLoadingBooking(true);
      bookingApi
        .getById(bookingId)
        .then((b) => {
          if (b) setBookingData(b);
        })
        .catch(() => {})
        .finally(() => setLoadingBooking(false));
    }
  }, [bookingId]);

  const handleRetryPayment = async () => {
    if (!bookingId) {
      toast.info("Redirecting to your rentals dashboard to resume payment...");
      window.location.href = "/dashboard/customer";
      return;
    }

    setRetrying(true);
    try {
      const res = await bookingApi.checkout(bookingId);
      if (res?.checkoutUrl) {
        toast.success("Redirecting to secure Stripe Checkout...");
        window.location.href = res.checkoutUrl;
      } else {
        toast.error("Could not obtain checkout session. Redirecting to rentals dashboard...");
        window.location.href = "/dashboard/customer";
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to initialize checkout retry.";
      toast.error(msg);
      setRetrying(false);
    }
  };

  const isCancelled = status === "cancelled" || status === "cancel";

  return (
    <div className="relative min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      {/* Gentle animated floating ambient background circles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            x: [0, 25, 0],
            y: [0, -30, 0],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-[#D99A42]/20 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 35, 0],
            opacity: [0.12, 0.22, 0.12],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-red-400/15 blur-3xl"
        />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="bg-white border border-[#E0DFD6] rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Animated Header Banner */}
          <div className="relative bg-gradient-to-br from-[#2D2A26] via-[#1F2421] to-[#141A17] text-white p-8 sm:p-10 text-center overflow-hidden">
            {/* Animated Wobbling / Pulsing Alert Badge */}
            <div className="relative mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{
                  scale: 1,
                  rotate: [0, -6, 6, -4, 4, -1, 1, 0],
                }}
                transition={{
                  scale: { type: "spring", stiffness: 280, damping: 20 },
                  rotate: { duration: 0.8, delay: 0.2 },
                }}
                className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-[#E59866] to-[#E74C3C] p-1.5 shadow-2xl flex items-center justify-center relative"
              >
                <div className="w-full h-full rounded-full bg-[#1F2421] flex items-center justify-center">
                  <AlertTriangle className="w-12 h-12 text-[#E59866]" />
                </div>

                {/* Animated Soft Glow Ring */}
                <motion.div
                  animate={{
                    scale: [1, 1.35, 1],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border-2 border-[#E59866]/50 pointer-events-none"
                />
              </motion.div>
            </div>

            {/* Empathetic Headline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E59866]/20 border border-[#E59866]/40 text-[#F5C26B] text-xs font-bold uppercase tracking-widest">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{isCancelled ? "Checkout Cancelled" : "Payment Incomplete"}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-[#F7F6F1] tracking-tight">
                {isCancelled ? "Checkout Was Cancelled" : "Payment Didn't Go Through"}
              </h1>

              <p className="text-sm sm:text-base text-[#D0DCD6] max-w-lg mx-auto leading-relaxed">
                No worries! No funds were deducted from your account, and your reservation request is safely saved in your account.
              </p>
            </motion.div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* If Booking Data is available, display preview of equipment */}
            {loadingBooking && (
              <div className="p-4 text-center text-xs text-[#6A726B] bg-[#F7F6F1] rounded-xl flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#183C32]" />
                <span>Retrieving reservation details...</span>
              </div>
            )}

            {bookingData && !loadingBooking && (
              <div className="bg-[#FAF9F5] border border-[#E5E4DC] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
                {bookingData.equipmentImage && (
                  <div className="relative w-full sm:w-24 h-24 rounded-lg overflow-hidden bg-white shrink-0 border border-[#E0DFD6]">
                    <Image
                      src={bookingData.equipmentImage}
                      alt={bookingData.equipmentTitle || "Equipment"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="space-y-1 flex-1 w-full text-center sm:text-left">
                  <div className="inline-block px-2 py-0.5 rounded-sm bg-[#D99A42]/15 text-[#8C6226] text-[10px] font-bold uppercase tracking-wider">
                    Pending Reservation Hold
                  </div>
                  <h3 className="font-heading text-base font-bold text-[#183C32]">
                    {bookingData.equipmentTitle || "Industrial Equipment"}
                  </h3>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#6A726B] pt-1">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#D99A42]" />
                      {bookingData.startDate ? new Date(bookingData.startDate).toLocaleDateString() : "Scheduled"}
                    </span>
                    {bookingData.totalAmount && (
                      <span className="font-bold text-[#183C32]">
                        Total: ${bookingData.totalAmount.toFixed(2)} USD
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Helpful Checklist: Why did this happen? */}
            <div className="bg-[#FDFBF7] border border-[#EFECE1] rounded-xl p-5 space-y-3 text-xs">
              <h4 className="font-heading text-sm font-bold text-[#183C32] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#D99A42]" />
                Common Reasons &amp; Quick Fixes
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[#5A635B]">
                <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-[#EBEAE3]">
                  <CreditCard className="w-4 h-4 text-[#183C32] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#183C32] block">Daily Spend / Limit</span>
                    <span>Industrial rentals may exceed daily card authorization thresholds.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-[#EBEAE3]">
                  <Clock className="w-4 h-4 text-[#183C32] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#183C32] block">Bank 3D-Secure Timeout</span>
                    <span>SMS or banking app authorization took longer than the timeout.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-[#EBEAE3]">
                  <RefreshCw className="w-4 h-4 text-[#183C32] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#183C32] block">Cancelled Checkout</span>
                    <span>The checkout window was closed or back button was pressed.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-[#EBEAE3]">
                  <ShieldAlert className="w-4 h-4 text-[#183C32] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#183C32] block">Card Issuer Verification</span>
                    <span>Some financial institutions require a quick confirmation call.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleRetryPayment}
                disabled={retrying}
                className="w-full sm:flex-1 py-3 px-5 bg-[#183C32] hover:bg-[#245344] disabled:bg-[#183C32]/60 text-[#F7F6F1] font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2 cursor-pointer group"
              >
                {retrying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#D99A42]" />
                    <span>Connecting to Stripe...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 text-[#D99A42] transition-transform group-hover:rotate-180" />
                    <span>Try Payment Again</span>
                  </>
                )}
              </button>

              <Link
                href="/dashboard/customer"
                className="w-full sm:w-auto py-3 px-5 bg-white hover:bg-[#F7F6F1] text-[#183C32] border border-[#DCDBCF] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors inline-flex items-center justify-center gap-2 text-center"
              >
                <span>View My Rentals</span>
                <ArrowRight className="w-4 h-4 text-[#6A726B]" />
              </Link>

              <Link
                href="/equipment"
                className="w-full sm:w-auto py-3 px-4 bg-white hover:bg-[#F7F6F1] text-[#6A726B] hover:text-[#183C32] border border-[#DCDBCF] font-semibold text-xs rounded-lg transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Browse Fleet</span>
              </Link>
            </div>

            {/* Assistance helpline */}
            <div className="pt-2 text-center text-xs text-[#8C948D] flex items-center justify-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-[#D99A42]" />
              <span>Need help completing your reservation? Call Dispatch:</span>
              <a href="tel:+18007368672" className="font-bold text-[#183C32] underline hover:text-[#245344]">
                +1 (800) RENTORA
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <div className="min-h-[80vh] bg-[#F7F6F1] flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="p-12 text-center text-xs text-[#6A726B]">
            <Loader2 className="w-7 h-7 animate-spin text-[#183C32] mx-auto mb-3" />
            Loading checkout status...
          </div>
        }
      >
        <PaymentFailedContent />
      </Suspense>
    </div>
  );
}
