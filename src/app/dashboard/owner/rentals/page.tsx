"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FileSpreadsheet,
  Search,
  Check,
  Loader2,
  PackageOpen,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { BookingStatus, PaymentStatus, RentalBooking } from "@/types";
import { ownerApi } from "@/lib/api";

export default function OwnerRentalsPage() {
  const { bookings: contextBookings, updateBookingStatus, updatePaymentStatus } = useApp();
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  // Query live owner bookings
  const { data, isLoading } = useQuery({
    queryKey: ["owner-bookings"],
    queryFn: () => ownerApi.getBookings(),
    staleTime: 30000,
  });

  const liveBookings: RentalBooking[] = data?.bookings || [];
  const mergedMap = new Map<string, RentalBooking>();
  for (const b of [...liveBookings, ...contextBookings]) {
    if (b && b.id && !mergedMap.has(b.id)) {
      mergedMap.set(b.id, b);
    }
  }

  const allBookings = Array.from(mergedMap.values());

  const filtered = allBookings.filter((b) => {
    if (filter !== "all" && b.bookingStatus !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        b.customerName.toLowerCase().includes(q) ||
        b.equipmentTitle.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D99A42]">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Fleet Dispatches &amp; Contracts</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#183C32]">
            Customer Rental Requisitions
          </h1>
          <p className="text-xs sm:text-sm text-[#6A726B] mt-0.5">
            Manage field mobilization confirmations, update lease milestones, and track escrow payouts.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-sm border border-[#E5E4DC] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "all", label: "All Leases" },
            { id: "confirmed", label: "Confirmed Active" },
            { id: "pending", label: "Pending Sign-off" },
            { id: "completed", label: "Completed & Returned" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-3 py-1.5 rounded-xs text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filter === t.id
                  ? "bg-[#183C32] text-white shadow-2xs"
                  : "text-[#555E57] hover:bg-[#F7F6F1]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-[#8A948D] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search contractor or machinery..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32]"
          />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="p-8 bg-white border border-[#E5E4DC] rounded-sm text-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#183C32] mx-auto mb-2" />
          <p className="text-xs text-[#6A726B]">Loading incoming rental dispatches...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="bg-white rounded-sm border border-[#E5E4DC] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EBEAE3] border-b border-[#DCDBCF] text-[#4A544E] uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order ID &amp; Contractor</th>
                  <th className="py-3 px-4">Equipment Listing</th>
                  <th className="py-3 px-4">Lease Window</th>
                  <th className="py-3 px-4">Escrow Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Lease Status</th>
                  <th className="py-3 px-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEBE3]">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-[#F7F6F1] transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[10px] text-[#8A948D] block">{b.id}</span>
                      <p className="font-bold text-[#183C32]">{b.customerName}</p>
                      <p className="text-[10px] text-[#6A726B]">{b.customerEmail}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#202824]">{b.equipmentTitle}</p>
                      <span className="text-[10px] text-[#6A726B]">
                        Qty: {b.quantity} • {b.equipmentCategory}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#202824] block">
                        {b.startDate} to {b.endDate}
                      </span>
                      <span className="text-[10px] text-[#8A948D] font-mono">{b.durationText}</span>
                    </td>

                    <td className="py-3.5 px-4 font-heading font-extrabold text-sm text-[#183C32]">
                      ${b.totalAmount.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={b.paymentStatus}
                        onChange={(e) =>
                          updatePaymentStatus(b.id, e.target.value as PaymentStatus)
                        }
                        className="text-[11px] font-bold px-2 py-1 rounded-xs bg-[#F7F6F1] border border-[#DCDBCF] text-[#183C32] cursor-pointer"
                      >
                        <option value="paid">Paid (Escrow)</option>
                        <option value="pending">Pending</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={b.bookingStatus}
                        onChange={(e) =>
                          updateBookingStatus(b.id, e.target.value as BookingStatus)
                        }
                        className="text-[11px] font-bold px-2 py-1 rounded-xs bg-[#183C32] text-white cursor-pointer"
                      >
                        <option value="confirmed">Confirmed Active</option>
                        <option value="pending">Pending Dispatch</option>
                        <option value="completed">Completed Pass</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {b.bookingStatus !== "completed" ? (
                        <button
                          onClick={() => updateBookingStatus(b.id, "completed")}
                          className="px-2.5 py-1 bg-[#2E6B4F] hover:bg-[#245344] text-white text-[10px] font-bold uppercase rounded-xs transition-colors inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                          title="Mark lease returned & inspect pass"
                        >
                          <Check className="w-3 h-3" />
                          <span>Sign Off</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#2E6B4F] font-bold">
                          Audit Passed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-sm border border-[#E5E4DC] text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#EBEAE3] text-[#6A726B] flex items-center justify-center mx-auto">
            <PackageOpen className="w-7 h-7" />
          </div>
          <h3 className="font-heading text-lg font-bold text-[#183C32]">
            No rental dispatches found
          </h3>
          <p className="text-xs sm:text-sm text-[#6A726B] max-w-md mx-auto">
            No active contractor requisitions found matching this status filter.
          </p>
        </div>
      )}
    </div>
  );
}
