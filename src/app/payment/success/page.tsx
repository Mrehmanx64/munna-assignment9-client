"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { paymentApi } from "@/lib/api";

type VerificationStatus = "verifying" | "confirmed" | "failed" | "pending";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<VerificationStatus>("verifying");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [paymentData, setPaymentData] = useState<any>(null);

  const verifyPayment = async (sid: string) => {
    setStatus("verifying");
    setErrorMessage("");
    try {
      const res = await paymentApi.verifySession(sid);
      const data = res?.data?.payment || res?.payment || res?.data;
      setPaymentData(data);
      setStatus("confirmed");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Payment verification could not be completed. Your payment may still be processing via webhook.";
      setErrorMessage(msg);
      // If error indicates already paid or processing, check status
      if (err?.response?.status === 400 && msg.includes("already")) {
        setStatus("confirmed");
      } else {
        setStatus("failed");
      }
    }
  };

  useEffect(() => {
    if (!sessionId || sessionId === "{CHECKOUT_SESSION_ID}") {
      setStatus("failed");
      setErrorMessage(
        "Invalid or missing checkout session identifier. If you completed payment, please check your customer dashboard."
      );
      return;
    }

    verifyPayment(sessionId);
  }, [sessionId]);

  return (
    <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-sm border border-[#E5E4DC] shadow-sm text-center">
      {status === "verifying" && (
        <div className="space-y-4 py-8">
          <div className="w-14 h-14 rounded-full bg-[#EBEAE3] text-[#183C32] flex items-center justify-center mx-auto">
            <Loader2 className="w-7 h-7 animate-spin text-[#183C32]" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-[#183C32]">
            Verifying Your Payment
          </h1>
          <p className="text-xs sm:text-sm text-[#6A726B] max-w-md mx-auto">
            Please wait while we confirm your Stripe checkout session with the Rentora escrow ledger...
          </p>
        </div>
      )}

      {status === "confirmed" && (
        <div className="space-y-5 py-4">
          <div className="w-16 h-16 rounded-full bg-green-50 text-green-700 flex items-center justify-center mx-auto border border-green-200">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E6B4F] mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Escrow Confirmed</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#183C32]">
              Rental Reservation Confirmed!
            </h1>
            <p className="text-xs sm:text-sm text-[#6A726B] mt-2 max-w-md mx-auto">
              Your payment has been verified and deposited into Rentora's secure escrow. Your machinery is reserved and awaiting owner dispatch.
            </p>
          </div>

          {paymentData && (
            <div className="bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs p-4 text-left text-xs space-y-1.5 my-4">
              <div className="flex justify-between">
                <span className="text-[#6A726B]">Transaction ID:</span>
                <span className="font-mono text-[#202824] truncate max-w-[200px]">
                  {paymentData.stripePaymentIntentId || paymentData._id || paymentData.id || sessionId}
                </span>
              </div>
              {paymentData.amount && (
                <div className="flex justify-between">
                  <span className="text-[#6A726B]">Amount Paid:</span>
                  <span className="font-bold text-[#183C32]">
                    ${paymentData.amount.toFixed(2)} USD
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#6A726B]">Escrow Status:</span>
                <span className="font-bold text-[#2E6B4F]">Held in Escrow</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard/customer"
              className="w-full sm:w-auto px-5 py-2.5 bg-[#183C32] hover:bg-[#245344] text-[#F7F6F1] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-xs inline-flex items-center justify-center gap-2"
            >
              <span>View My Rentals</span>
              <ArrowRight className="w-4 h-4 text-[#D99A42]" />
            </Link>
            <Link
              href="/equipment"
              className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-[#EBEAE3] text-[#183C32] border border-[#DCDBCF] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors"
            >
              Browse More Machinery
            </Link>
          </div>
        </div>
      )}

      {status === "failed" && (
        <div className="space-y-5 py-4">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
            <XCircle className="w-9 h-9" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#183C32]">
              Payment Verification Unconfirmed
            </h1>
            <p className="text-xs sm:text-sm text-[#6A726B] mt-2 max-w-md mx-auto">
              {errorMessage ||
                "We were unable to verify this transaction. Your card has not been charged or the payment webhook is still processing."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            {sessionId && (
              <button
                onClick={() => verifyPayment(sessionId)}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#183C32] hover:bg-[#245344] text-[#F7F6F1] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-xs inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Verification</span>
              </button>
            )}
            <Link
              href="/dashboard/customer"
              className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-[#EBEAE3] text-[#183C32] border border-[#DCDBCF] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors"
            >
              Go to Customer Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-[70vh] bg-[#F7F6F1] flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="p-12 text-center text-xs text-[#6A726B]">
            <Loader2 className="w-6 h-6 animate-spin text-[#183C32] mx-auto mb-2" />
            Loading payment verification...
          </div>
        }
      >
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
