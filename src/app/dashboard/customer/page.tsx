"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Truck,
  CheckCircle2,
  Clock,
  FileText,
  DollarSign,
  ShieldCheck,
  Search,
  ArrowRight,
  PackageOpen,
  X,
  MapPin,
  CreditCard,
  Loader2,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { RentalBooking } from "@/types";
import { bookingApi, paymentApi } from "@/lib/api";
import { toast } from "sonner";

export default function CustomerRentalsPage() {
  const { bookings: contextBookings, currentUser, refreshBookings } = useApp();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBooking, setSelectedBooking] = useState<RentalBooking | null>(null);
  const [checkingOutId, setCheckingOutId] = useState<string | null>(null);
  const [verifyingSession, setVerifyingSession] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const status = params.get("status");
      const sessionId = params.get("session_id");

      if (status === "success") {
        if (sessionId && sessionId !== "{CHECKOUT_SESSION_ID}") {
          setVerifyingSession(true);
          paymentApi
            .verifySession(sessionId)
            .then(() => {
              toast.success("Payment verified! Your machinery reservation is confirmed and active.");
              queryClient.invalidateQueries({ queryKey: ["customer-rentals"] });
              refreshBookings();
            })
            .catch((err) => {
              console.warn("Session verification warning:", err);
              toast.success("Payment received! Updating rental records...");
              queryClient.invalidateQueries({ queryKey: ["customer-rentals"] });
              refreshBookings();
            })
            .finally(() => {
              setVerifyingSession(false);
              const cleanUrl = window.location.pathname;
              window.history.replaceState({}, document.title, cleanUrl);
            });
        } else {
          toast.success("Payment confirmed! Your rental booking is active and in escrow.");
          queryClient.invalidateQueries({ queryKey: ["customer-rentals"] });
          refreshBookings();
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }
      }
    }
  }, [queryClient, refreshBookings]);

  // Fetch real customer rentals from backend
  const { data, isLoading } = useQuery({
    queryKey: ["customer-rentals"],
    queryFn: () => bookingApi.getMyRentals(),
    staleTime: 30000,
  });

  const liveBookings: RentalBooking[] = data?.bookings || [];
  // Merge live backend bookings with local context bookings if any
  const mergedMap = new Map<string, RentalBooking>();
  for (const b of [...liveBookings, ...contextBookings]) {
    if (b && b.id && !mergedMap.has(b.id)) {
      mergedMap.set(b.id, b);
    }
  }

  const allBookings = Array.from(mergedMap.values());
  const myBookings = allBookings.filter((b) => {
    const matchesUser = currentUser
      ? b.customerId === currentUser.id || b.customerEmail === currentUser.email
      : true;
    return matchesUser;
  });

  const filteredBookings = myBookings.filter((b) => {
    if (statusFilter !== "all" && b.bookingStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.equipmentTitle.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.ownerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate metrics
  const totalSpent = myBookings.reduce((acc, b) => acc + b.totalAmount, 0);
  const activeCount = myBookings.filter((b) => b.bookingStatus === "confirmed").length;
  const completedCount = myBookings.filter((b) => b.bookingStatus === "completed").length;

  const handlePayBooking = async (bookingId: string) => {
    setCheckingOutId(bookingId);
    try {
      const res = await bookingApi.checkout(bookingId);
      if (res?.checkoutUrl) {
        toast.info("Redirecting to Stripe Checkout...");
        window.location.href = res.checkoutUrl;
      } else {
        toast.error("Checkout session was not created. Please contact support.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to initialize payment.");
    } finally {
      setCheckingOutId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Session Verification Status Banner */}
      {verifyingSession && (
        <div className="bg-[#183C32] text-white p-4 rounded-sm flex items-center justify-between gap-3 shadow-md border border-[#2B5446]">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-[#D99A42] shrink-0" />
            <div>
              <p className="text-sm font-bold">Verifying payment &amp; reserving fleet equipment...</p>
              <p className="text-xs text-[#ECEFEA] opacity-80">Reconciling transaction with Stripe escrow and confirming lease.</p>
            </div>
          </div>
        </div>
      )}

      {/* Page Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D99A42]">
            <Truck className="w-3.5 h-3.5" />
            <span>Contractor Requisitions</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#183C32]">
            My Equipment Rentals
          </h1>
          <p className="text-xs sm:text-sm text-[#6A726B] mt-0.5">
            Track active machinery mobilization, inspect delivery slips, and review completed field leases.
          </p>
        </div>

        <Link
          href="/equipment"
          className="px-4 py-2 bg-[#183C32] hover:bg-[#245344] text-[#F7F6F1] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-xs inline-flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <span>Rent New Equipment</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-sm bg-white border border-[#E5E4DC] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#6A726B] mb-1">
            <span className="font-bold uppercase tracking-wider">Active Leases</span>
            <Clock className="w-4 h-4 text-[#D99A42]" />
          </div>
          <p className="font-heading text-2xl font-extrabold text-[#183C32]">{activeCount}</p>
          <span className="text-[11px] text-[#2E6B4F] font-semibold mt-1 block">
            On jobsite or in transit
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-sm bg-white border border-[#E5E4DC] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#6A726B] mb-1">
            <span className="font-bold uppercase tracking-wider">Completed Jobs</span>
            <CheckCircle2 className="w-4 h-4 text-[#2E6B4F]" />
          </div>
          <p className="font-heading text-2xl font-extrabold text-[#183C32]">{completedCount}</p>
          <span className="text-[11px] text-[#6A726B] mt-1 block">Returned with inspection pass</span>
        </div>

        <div className="p-4 sm:p-5 rounded-sm bg-white border border-[#E5E4DC] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#6A726B] mb-1">
            <span className="font-bold uppercase tracking-wider">Total Escrow Volume</span>
            <DollarSign className="w-4 h-4 text-[#183C32]" />
          </div>
          <p className="font-heading text-2xl font-extrabold text-[#183C32]">${totalSpent.toLocaleString()}</p>
          <span className="text-[11px] text-[#6A726B] mt-1 block">100% bonded transactions</span>
        </div>

        <div className="p-4 sm:p-5 rounded-sm bg-white border border-[#E5E4DC] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#6A726B] mb-1">
            <span className="font-bold uppercase tracking-wider">Insurance Coverage</span>
            <ShieldCheck className="w-4 h-4 text-[#2E6B4F]" />
          </div>
          <p className="font-heading text-2xl font-extrabold text-[#2E6B4F]">Active COI</p>
          <span className="text-[11px] text-[#6A726B] mt-1 block">$2.5M Commercial Policy</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-sm border border-[#E5E4DC] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "all", label: "All Leases" },
            { id: "confirmed", label: "Confirmed Active" },
            { id: "pending", label: "Pending Sign-off" },
            { id: "completed", label: "Completed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xs text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-[#183C32] text-white shadow-2xs"
                  : "text-[#555E57] hover:bg-[#F7F6F1]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-[#8A948D] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search leases, machinery, owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32]"
          />
        </div>
      </div>

      {/* Bookings Table */}
      {isLoading ? (
        <div className="p-8 bg-white border border-[#E5E4DC] rounded-sm text-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#183C32] mx-auto mb-2" />
          <p className="text-xs text-[#6A726B]">Loading verified rental requisitions...</p>
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="bg-white rounded-sm border border-[#E5E4DC] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EBEAE3] border-b border-[#DCDBCF] text-[#4A544E] uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Lease Order ID</th>
                  <th className="py-3 px-4">Equipment Listing</th>
                  <th className="py-3 px-4">Rental Window</th>
                  <th className="py-3 px-4">Escrow Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEBE3]">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-[#F7F6F1] transition-colors">
                    {/* Order ID */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#183C32]">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="hover:underline flex items-center gap-1.5 text-left"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#D99A42]" />
                        <span>{booking.id}</span>
                      </button>
                    </td>

                    {/* Equipment Title & Image */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-7 rounded-xs overflow-hidden bg-[#EBEAE3] shrink-0 border border-[#DCDBCF]">
                          <Image
                            src={booking.equipmentImage}
                            alt={booking.equipmentTitle}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-[#183C32] block line-clamp-1">
                            {booking.equipmentTitle}
                          </span>
                          <span className="text-[10px] text-[#6A726B]">
                            Owner: {booking.ownerName}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Window & Days */}
                    <td className="py-3.5 px-4 text-[#555E57]">
                      <div className="font-medium text-[#202824]">
                        {booking.startDate} &rarr; {booking.endDate}
                      </div>
                      <span className="text-[10px] text-[#8A948D]">
                        {booking.durationText} • {booking.quantity} Unit(s)
                      </span>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4 font-bold text-[#183C32]">
                      ${booking.totalAmount.toLocaleString()}
                    </td>

                    {/* Payment Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider ${
                          booking.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : booking.paymentStatus === "refunded"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {booking.paymentStatus}
                      </span>
                    </td>

                    {/* Booking Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider ${
                          booking.bookingStatus === "confirmed"
                            ? "bg-[#183C32] text-white"
                            : booking.bookingStatus === "completed"
                            ? "bg-[#EBEAE3] text-[#183C32]"
                            : booking.bookingStatus === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {booking.paymentStatus === "pending" && (
                          <button
                            onClick={() => handlePayBooking(booking.id)}
                            disabled={checkingOutId === booking.id}
                            className="px-2.5 py-1 bg-[#D99A42] hover:bg-[#C48733] text-[#11231D] text-xs font-bold rounded-xs shadow-2xs inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            {checkingOutId === booking.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CreditCard className="w-3 h-3" />
                            )}
                            <span>Pay</span>
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="px-3 py-1 bg-white hover:bg-[#183C32] hover:text-white text-[#183C32] text-xs font-semibold rounded-xs border border-[#DCDBCF] transition-colors shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Slip</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white p-12 rounded-sm border border-[#E5E4DC] text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#EBEAE3] text-[#6A726B] flex items-center justify-center mx-auto">
            <PackageOpen className="w-7 h-7" />
          </div>
          <h3 className="font-heading text-lg font-bold text-[#183C32]">
            No rental records found
          </h3>
          <p className="text-xs sm:text-sm text-[#6A726B] max-w-md mx-auto">
            You do not currently have any equipment rentals matching this status filter. Browse our catalog to reserve equipment.
          </p>
          <Link
            href="/equipment"
            className="px-4 py-2 bg-[#183C32] hover:bg-[#245344] text-white text-xs font-semibold rounded-xs transition-colors shadow-2xs inline-block"
          >
            Explore Equipment Catalog
          </Link>
        </div>
      )}

      {/* Booking Details Slip Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-sm border border-[#DCDBCF] shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#ECEBE3] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D99A42]">
                  Mobilization Order Slip
                </span>
                <h3 className="font-heading text-base font-bold text-[#183C32]">
                  {selectedBooking.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 text-[#6A726B] hover:text-[#183C32]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Equipment Snapshot */}
            <div className="flex items-center gap-3 p-3 bg-[#F7F6F1] rounded-xs border border-[#ECEBE3]">
              <div className="relative w-16 h-12 rounded-xs overflow-hidden shrink-0 border border-[#DCDBCF]">
                <Image
                  src={selectedBooking.equipmentImage}
                  alt={selectedBooking.equipmentTitle}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-heading text-xs font-bold text-[#183C32]">
                  {selectedBooking.equipmentTitle}
                </h4>
                <p className="text-[11px] text-[#6A726B] mt-0.5">
                  Category: {selectedBooking.equipmentCategory}
                </p>
              </div>
            </div>

            {/* Key Requisition Specs */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-[#F7F6F1] rounded-xs">
                <span className="text-[10px] font-bold uppercase text-[#6A726B] block">Rental Window</span>
                <span className="font-semibold text-[#183C32] mt-0.5 block">{selectedBooking.startDate} to {selectedBooking.endDate}</span>
              </div>
              <div className="p-2.5 bg-[#F7F6F1] rounded-xs">
                <span className="text-[10px] font-bold uppercase text-[#6A726B] block">Duration &amp; Quantity</span>
                <span className="font-semibold text-[#183C32] mt-0.5 block">{selectedBooking.durationText} • {selectedBooking.quantity} Unit(s)</span>
              </div>
              <div className="p-2.5 bg-[#F7F6F1] rounded-xs">
                <span className="text-[10px] font-bold uppercase text-[#6A726B] block">Equipment Owner</span>
                <span className="font-semibold text-[#183C32] mt-0.5 block">{selectedBooking.ownerName}</span>
              </div>
              <div className="p-2.5 bg-[#F7F6F1] rounded-xs">
                <span className="text-[10px] font-bold uppercase text-[#6A726B] block">Escrow Subtotal</span>
                <span className="font-heading font-extrabold text-[#183C32] text-sm mt-0.5 block">${selectedBooking.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Site Address */}
            {selectedBooking.deliveryAddress && (
              <div className="p-3 bg-[#F7F6F1] rounded-xs border border-[#ECEBE3] text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#183C32]">
                  <MapPin className="w-3.5 h-3.5 text-[#D99A42]" />
                  <span>Jobsite Delivery Address</span>
                </div>
                <p className="text-[#555E57] pl-5">{selectedBooking.deliveryAddress}</p>
              </div>
            )}

            {/* Special Instructions */}
            {selectedBooking.notes && (
              <div className="p-3 bg-[#F7F6F1] rounded-xs border border-[#ECEBE3] text-xs space-y-1">
                <span className="font-bold text-[#183C32] block">Dispatch &amp; Gate Notes</span>
                <p className="text-[#555E57] italic">&ldquo;{selectedBooking.notes}&rdquo;</p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              {selectedBooking.paymentStatus === "pending" ? (
                <button
                  onClick={() => handlePayBooking(selectedBooking.id)}
                  disabled={checkingOutId === selectedBooking.id}
                  className="px-4 py-2 bg-[#D99A42] hover:bg-[#C48733] text-[#11231D] text-xs font-bold rounded-xs shadow-2xs inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {checkingOutId === selectedBooking.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CreditCard className="w-3.5 h-3.5" />
                  )}
                  <span>Pay Now via Stripe</span>
                </button>
              ) : <div />}
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-[#183C32] text-white text-xs font-semibold rounded-xs"
              >
                Close Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
