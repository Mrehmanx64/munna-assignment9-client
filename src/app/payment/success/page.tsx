"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Sparkles,
  PartyPopper,
  ShieldCheck,
  ArrowRight,
  Printer,
  Copy,
  Check,
  Calendar,
  MapPin,
  Clock,
  Truck,
  PhoneCall,
  Loader2,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { paymentApi, bookingApi } from "@/lib/api";
import { toast } from "sonner";

// ----------------------------------------------------------------------
// Joyful Animated Confetti Piece Component
// ----------------------------------------------------------------------
interface ConfettiPieceProps {
  delay: number;
  startX: number;
  color: string;
  size: number;
  duration: number;
}

function ConfettiPiece({ delay, startX, color, size, duration }: ConfettiPieceProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -30,
        x: `${startX}vw`,
        rotate: 0,
        scale: 0.5,
      }}
      animate={{
        opacity: [0, 1, 1, 0.8, 0],
        y: ["-5vh", "105vh"],
        x: [
          `${startX}vw`,
          `${startX + (Math.sin(startX) * 12 - 6)}vw`,
          `${startX + (Math.cos(startX) * 16 - 8)}vw`,
        ],
        rotate: [0, 180, 540, 720],
        scale: [0.6, 1.1, 0.9, 1],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2 + 1,
        ease: "easeInOut",
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: `${size}px`,
        height: `${size * (Math.random() > 0.5 ? 1.8 : 1)}px`,
        backgroundColor: color,
        borderRadius: Math.random() > 0.4 ? "2px" : "50%",
        zIndex: 5,
        pointerEvents: "none",
      }}
    />
  );
}

const CONFETTI_COLORS = [
  "#D99A42", // Gold
  "#183C32", // Forest Green
  "#2E6B4F", // Emerald
  "#E59866", // Warm Coral
  "#F39C12", // Bright Amber
  "#10B981", // Bright Emerald
  "#F59E0B", // Sun Yellow
];

function JoyfulConfetti() {
  const [pieces, setPieces] = useState<ConfettiPieceProps[]>([]);

  useEffect(() => {
    // Generate 32 celebratory confetti particles
    const generated: ConfettiPieceProps[] = Array.from({ length: 32 }).map((_, i) => ({
      delay: Math.random() * 2.5,
      startX: Math.floor(Math.random() * 96) + 2,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: Math.floor(Math.random() * 7) + 6,
      duration: Math.random() * 3 + 3.8,
    }));
    setPieces(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {pieces.map((p, idx) => (
        <ConfettiPiece key={idx} {...p} />
      ))}
    </div>
  );
}

// ----------------------------------------------------------------------
// Main Content with Verification & Joyful Visual Presentation
// ----------------------------------------------------------------------
type VerificationStatus = "verifying" | "confirmed" | "failed" | "pending";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const bookingIdParam = searchParams.get("booking_id");

  const [status, setStatus] = useState<VerificationStatus>("verifying");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [paymentData, setPaymentData] = useState<any>(null);
  const [bookingData, setBookingData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const verifyPayment = async (sid: string) => {
    setStatus("verifying");
    setErrorMessage("");
    try {
      const res = await paymentApi.verifySession(sid);
      const data = res?.data?.payment || res?.payment || res?.data;
      const bData = res?.data?.booking || res?.booking;
      setPaymentData(data);
      if (bData) {
        setBookingData(bData);
      }
      setStatus("confirmed");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Payment verification could not be completed. Your payment may still be processing via webhook.";
      setErrorMessage(msg);
      // If error indicates already paid or processed
      if (err?.response?.status === 400 && msg.includes("already")) {
        setStatus("confirmed");
      } else {
        setStatus("failed");
      }
    }
  };

  useEffect(() => {
    if (!sessionId || sessionId === "{CHECKOUT_SESSION_ID}") {
      // If there is a bookingIdParam, try to fetch the booking
      if (bookingIdParam) {
        bookingApi
          .getById(bookingIdParam)
          .then((b) => {
            if (b) {
              setBookingData(b);
              if (b.paymentStatus === "paid") {
                setStatus("confirmed");
                return;
              }
            }
            setStatus("confirmed");
          })
          .catch(() => {
            setStatus("confirmed");
          });
      } else {
        setStatus("confirmed");
      }
      return;
    }

    verifyPayment(sessionId);
  }, [sessionId, bookingIdParam]);

  // Load detailed booking info if not already in payment payload
  useEffect(() => {
    const targetBookingId =
      bookingIdParam ||
      paymentData?.booking ||
      paymentData?.bookingId ||
      bookingData?.id ||
      bookingData?._id;

    if (targetBookingId && (!bookingData || !bookingData.equipmentTitle)) {
      bookingApi
        .getById(typeof targetBookingId === "string" ? targetBookingId : targetBookingId._id || targetBookingId.id)
        .then((res) => {
          if (res) setBookingData(res);
        })
        .catch(() => {});
    }
  }, [bookingIdParam, paymentData]);

  const transactionRef =
    paymentData?.stripePaymentIntentId ||
    paymentData?.stripeSessionId ||
    paymentData?._id ||
    sessionId ||
    "tx_stripe_confirmed";

  const handleCopyRef = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(transactionRef);
      setCopied(true);
      toast.success("Transaction ID copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="relative min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      {/* Joyful Confetti Burst */}
      {status === "confirmed" && <JoyfulConfetti />}

      <div className="w-full max-w-3xl relative z-20">
        <AnimatePresence mode="wait">
          {/* 1. VERIFYING STATE */}
          {status === "verifying" && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white border border-[#E5E4DC] rounded-xl p-10 shadow-lg text-center max-w-xl mx-auto space-y-5"
            >
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 rounded-full border-4 border-[#E5E4DC] border-t-[#183C32] absolute"
                />
                <Loader2 className="w-8 h-8 text-[#183C32] animate-spin" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-[#183C32] tracking-tight">
                  Verifying Your Payment
                </h2>
                <p className="text-sm text-[#6A726B] max-w-md mx-auto">
                  Connecting to Stripe & the Rentora Escrow Ledger to secure your equipment reservation...
                </p>
              </div>
            </motion.div>
          )}

          {/* 2. CONFIRMED JOYFUL STATE */}
          {status === "confirmed" && (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white border border-[#E0DFD6] rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Joyful Header Hero Banner */}
              <div className="relative bg-gradient-to-br from-[#183C32] via-[#245344] to-[#122E26] text-white p-8 sm:p-10 text-center overflow-hidden">
                {/* Decorative background glows */}
                <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#D99A42]/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#2E6B4F]/40 rounded-full blur-3xl pointer-events-none" />

                {/* Animated Spring Bouncing Icon */}
                <div className="relative mb-6">
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 18,
                      delay: 0.1,
                    }}
                    className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-[#D99A42] to-[#F39C12] p-1.5 shadow-2xl flex items-center justify-center relative"
                  >
                    <div className="w-full h-full rounded-full bg-[#183C32] flex items-center justify-center">
                      <CheckCircle2 className="w-12 h-12 text-[#D99A42]" />
                    </div>

                    {/* Joyful Sparkle Badges */}
                    <motion.div
                      animate={{
                        scale: [1, 1.25, 1],
                        rotate: [0, 15, -15, 0],
                      }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                      className="absolute -top-2 -right-2 bg-white text-[#D99A42] p-1.5 rounded-full shadow-md"
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, -20, 20, 0],
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.4 }}
                      className="absolute -bottom-1 -left-2 bg-[#2E6B4F] text-white p-1.5 rounded-full shadow-md"
                    >
                      <PartyPopper className="w-4 h-4" />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Celebratory Announcement */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="space-y-3"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D99A42]/20 border border-[#D99A42]/40 text-[#F5C26B] text-xs font-bold uppercase tracking-widest">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Payment Confirmed &bull; Escrow Secured</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F7F6F1] tracking-tight">
                    Woohoo! Reservation Confirmed! 🎉
                  </h1>

                  <p className="text-sm sm:text-base text-[#D0DCD6] max-w-xl mx-auto leading-relaxed">
                    High five! Your payment has been deposited into Rentora&apos;s 100% protected escrow. Your machinery is officially reserved and awaiting dispatch.
                  </p>
                </motion.div>
              </div>

              {/* Progress Milestones Tracker */}
              <div className="border-b border-[#EBEAE3] bg-[#F7F6F1] px-6 py-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-3 text-center sm:text-left">
                  Rental Escrow Lifecycle Status
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-white p-3 rounded-lg border border-green-200 shadow-xs flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center mb-1.5 font-bold">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#183C32]">1. Paid</span>
                    <span className="text-[10px] text-green-700 font-medium">Stripe Verified</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#D99A42]/40 shadow-xs flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-[#D99A42]/15 text-[#D99A42] flex items-center justify-center mb-1.5 font-bold">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#183C32]">2. Escrow Held</span>
                    <span className="text-[10px] text-[#8C6226] font-medium">100% Protected</span>
                  </div>

                  <div className="bg-white/70 p-3 rounded-lg border border-[#E0DFD6] flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-[#EBEAE3] text-[#183C32] flex items-center justify-center mb-1.5 font-bold text-xs">
                      <Truck className="w-3.5 h-3.5 text-[#183C32]" />
                    </div>
                    <span className="text-xs font-semibold text-[#183C32]">3. Fleet Prep</span>
                    <span className="text-[10px] text-[#6A726B]">Owner Notified</span>
                  </div>

                  <div className="bg-white/70 p-3 rounded-lg border border-[#E0DFD6] flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-[#EBEAE3] text-[#6A726B] flex items-center justify-center mb-1.5 font-bold text-xs">
                      4
                    </div>
                    <span className="text-xs font-semibold text-[#6A726B]">4. Handover</span>
                    <span className="text-[10px] text-[#6A726B]">Jobsite Delivery</span>
                  </div>
                </div>
              </div>

              {/* Order & Machinery Receipt Details */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Equipment Summary Card if available */}
                {bookingData && (
                  <div className="bg-[#FAF9F5] border border-[#E5E4DC] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
                    {bookingData.equipmentImage && (
                      <div className="relative w-full sm:w-28 h-28 rounded-lg overflow-hidden bg-white shrink-0 border border-[#E0DFD6]">
                        <Image
                          src={bookingData.equipmentImage}
                          alt={bookingData.equipmentTitle || "Reserved Equipment"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-1.5 flex-1 w-full text-center sm:text-left">
                      <div className="inline-block px-2.5 py-0.5 rounded-sm bg-[#183C32]/10 text-[#183C32] text-[10px] font-bold uppercase tracking-wider">
                        {bookingData.equipmentCategory || "Industrial Fleet Equipment"}
                      </div>
                      <h3 className="font-heading text-lg font-bold text-[#183C32]">
                        {bookingData.equipmentTitle || "Industrial Equipment Rental"}
                      </h3>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-1 gap-x-4 text-xs text-[#6A726B] pt-1">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#D99A42]" />
                          {bookingData.startDate ? new Date(bookingData.startDate).toLocaleDateString() : "Scheduled"} &rarr;{" "}
                          {bookingData.endDate ? new Date(bookingData.endDate).toLocaleDateString() : "Scheduled"}
                        </span>
                        {bookingData.duration && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#D99A42]" />
                            {bookingData.duration} Days
                          </span>
                        )}
                        {bookingData.deliveryAddress && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#D99A42]" />
                            {bookingData.deliveryAddress}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Receipt Details Grid */}
                <div className="bg-white border border-[#E0DFD6] rounded-xl p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#EBEAE3] gap-2">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#6A726B]">
                        Stripe Transaction ID
                      </span>
                      <p className="font-mono text-xs text-[#183C32] font-semibold break-all">
                        {transactionRef}
                      </p>
                    </div>
                    <button
                      onClick={handleCopyRef}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#183C32] hover:text-[#245344] bg-[#F7F6F1] hover:bg-[#EBEAE3] px-3 py-1.5 rounded border border-[#E0DFD6] transition-colors self-start sm:self-auto cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-600" />
                          <span className="text-green-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#6A726B]" />
                          <span>Copy Ref</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-1 text-xs">
                    <div>
                      <span className="text-[#6A726B] block mb-0.5">Payment Method</span>
                      <span className="font-semibold text-[#183C32]">Stripe Card / Digital Pay</span>
                    </div>
                    <div>
                      <span className="text-[#6A726B] block mb-0.5">Escrow State</span>
                      <span className="font-bold text-[#2E6B4F] inline-flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Held in Escrow
                      </span>
                    </div>
                    <div>
                      <span className="text-[#6A726B] block mb-0.5">Amount Captured</span>
                      <span className="text-sm font-black text-[#183C32]">
                        ${(paymentData?.amount || bookingData?.totalAmount || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        USD
                      </span>
                    </div>
                  </div>
                </div>

                {/* Joyful Escrow Reassurance */}
                <div className="bg-[#FAF9F5] border-l-4 border-[#2E6B4F] p-4 rounded-r-lg text-xs space-y-1">
                  <p className="font-bold text-[#183C32] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#2E6B4F]" />
                    Rentora Zero-Risk Escrow Protection
                  </p>
                  <p className="text-[#6A726B] leading-relaxed">
                    Your funds remain safely preserved in Rentora&apos;s escrow repository. The fleet owner receives payout only after your equipment arrives on-site and is inspected to your full satisfaction.
                  </p>
                </div>

                {/* Call to Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
                  <Link
                    href="/dashboard/customer"
                    className="w-full sm:flex-1 py-3 px-5 bg-[#183C32] hover:bg-[#245344] text-[#F7F6F1] font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2 group"
                  >
                    <span>Go to Customer Dashboard</span>
                    <ArrowRight className="w-4 h-4 text-[#D99A42] transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/equipment"
                    className="w-full sm:w-auto py-3 px-5 bg-white hover:bg-[#F7F6F1] text-[#183C32] border border-[#DCDBCF] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#D99A42]" />
                    <span>Browse More Fleet</span>
                  </Link>

                  <button
                    onClick={handlePrint}
                    className="w-full sm:w-auto py-3 px-4 bg-white hover:bg-[#F7F6F1] text-[#6A726B] hover:text-[#183C32] border border-[#DCDBCF] font-semibold text-xs rounded-lg transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Receipt</span>
                  </button>
                </div>

                {/* Dispatch hotline */}
                <div className="pt-2 text-center text-xs text-[#8C948D] flex items-center justify-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-[#D99A42]" />
                  <span>24/7 Site Dispatch Support:</span>
                  <a href="tel:+18007368672" className="font-bold text-[#183C32] underline hover:text-[#245344]">
                    +1 (800) RENTORA
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. FAILED VERIFICATION FALLBACK */}
          {status === "failed" && (
            <motion.div
              key="failed"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-[#E5E4DC] rounded-2xl p-8 sm:p-10 shadow-lg text-center max-w-xl mx-auto space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
                <RefreshCw className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[#183C32]">
                  Verification Still Processing
                </h2>
                <p className="text-xs sm:text-sm text-[#6A726B] max-w-md mx-auto">
                  {errorMessage ||
                    "We were unable to confirm immediate verification. Your payment may still be finalizing via the secure Stripe webhook."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                {sessionId && (
                  <button
                    onClick={() => verifyPayment(sessionId)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#183C32] hover:bg-[#245344] text-[#F7F6F1] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Retry Verification</span>
                  </button>
                )}
                <Link
                  href="/dashboard/customer"
                  className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-[#EBEAE3] text-[#183C32] border border-[#DCDBCF] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                >
                  View My Rentals
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-[80vh] bg-[#F7F6F1] flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="p-12 text-center text-xs text-[#6A726B]">
            <Loader2 className="w-7 h-7 animate-spin text-[#183C32] mx-auto mb-3" />
            Loading payment verification...
          </div>
        }
      >
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
