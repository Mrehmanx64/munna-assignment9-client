"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Truck,
  Search,
  Loader2,
  PackageOpen,
} from "lucide-react";
import { RentalBooking } from "@/types";
import { adminApi } from "@/lib/api";

export default function AdminAllRentalsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Query live admin platform bookings
  const { data, isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => adminApi.getBookings(),
    staleTime: 30000,
  });

  const allBookings: RentalBooking[] = data?.bookings || [];

  const filtered = allBookings.filter((b) => {
    if (statusFilter !== "all" && b.bookingStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        b.customerName.toLowerCase().includes(q) ||
        b.ownerName.toLowerCase().includes(q) ||
        b.equipmentTitle.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalGMV = allBookings.reduce((acc, b) => acc + b.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D99A42]">
            <Truck className="w-3.5 h-3.5" />
            <span>Master Escrow Ledger</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#183C32]">
            All Platform Equipment Leases
          </h1>
          <p className="text-xs sm:text-sm text-[#6A726B] mt-0.5">
            Real-time ledger of all contractor rentals, verified COI policies, and owner disbursements.
          </p>
        </div>

        <div className="px-4 py-2 bg-[#EBEAE3] border border-[#DCDBCF] rounded-xs text-xs text-[#183C32] self-start sm:self-auto font-semibold">
          Total Escrow Volume: <span className="font-extrabold text-[#183C32]">${totalGMV.toLocaleString()}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-sm border border-[#E5E4DC] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "all", label: "All Leases" },
            { id: "confirmed", label: "Confirmed Active" },
            { id: "pending", label: "Pending Sign-off" },
            { id: "completed", label: "Completed" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setStatusFilter(t.id)}
              className={`px-3 py-1.5 rounded-xs text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === t.id
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
            placeholder="Search renter, owner, or machine..."
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
          <p className="text-xs text-[#6A726B]">Loading master escrow ledger...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="bg-white rounded-sm border border-[#E5E4DC] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EBEAE3] border-b border-[#DCDBCF] text-[#4A544E] uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Lease ID &amp; Contractor</th>
                  <th className="py-3 px-4">Equipment &amp; Category</th>
                  <th className="py-3 px-4">Fleet Owner</th>
                  <th className="py-3 px-4">Rental Duration</th>
                  <th className="py-3 px-4">Escrow Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEBE3]">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-[#F7F6F1] transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[10px] text-[#8A948D] block">{b.id}</span>
                      <span className="font-bold text-[#183C32] block">{b.customerName}</span>
                      <span className="text-[10px] text-[#6A726B]">{b.customerEmail}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <Link
                        href={`/equipment/${b.equipmentId}`}
                        className="font-semibold text-[#202824] hover:underline block max-w-xs truncate"
                      >
                        {b.equipmentTitle}
                      </Link>
                      <span className="text-[10px] text-[#6A726B]">
                        {b.equipmentCategory} • Qty: {b.quantity}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-[#183C32]">{b.ownerName}</span>
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
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider ${
                          b.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider ${
                          b.bookingStatus === "confirmed"
                            ? "bg-[#183C32] text-white"
                            : b.bookingStatus === "completed"
                            ? "bg-[#EBEAE3] text-[#183C32]"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
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
            No platform leases match this filter
          </h3>
          <p className="text-xs sm:text-sm text-[#6A726B] max-w-md mx-auto">
            All current contracts and requisitions are catalogued in the system.
          </p>
        </div>
      )}
    </div>
  );
}
