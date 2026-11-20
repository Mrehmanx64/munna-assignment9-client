"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Check,
  X as XIcon,
  Trash2,
  Eye,
  Search,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function AdminEquipmentPage() {
  const { equipmentList, updateEquipmentStatus, deleteEquipment } = useApp();
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = equipmentList.filter((eq) => {
    if (statusFilter !== "all" && eq.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        eq.title.toLowerCase().includes(q) ||
        eq.ownerName.toLowerCase().includes(q) ||
        eq.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D99A42]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Fleet Quality &amp; Safety Audit</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#183C32]">
            Equipment Approvals &amp; Fleet Management
          </h1>
          <p className="text-xs sm:text-sm text-[#6A726B] mt-0.5">
            Audit newly submitted machinery against commercial safety standards before publishing to the live marketplace.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-sm border border-[#E5E4DC] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "all", label: "All Equipment" },
            { id: "pending", label: "Pending Audit" },
            { id: "active", label: "Live & Active" },
            { id: "rejected", label: "Rejected" },
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
            placeholder="Search equipment or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32]"
          />
        </div>
      </div>

      {/* Equipment Table */}
      <div className="bg-white rounded-sm border border-[#E5E4DC] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EBEAE3] border-b border-[#DCDBCF] text-[#4A544E] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Equipment &amp; Brand</th>
                <th className="py-3 px-4">Fleet Owner</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Daily Rate</th>
                <th className="py-3 px-4">Audit Status</th>
                <th className="py-3 px-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEBE3]">
              {filtered.map((eq) => (
                <tr key={eq.id} className="hover:bg-[#F7F6F1] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-9 rounded-xs overflow-hidden bg-[#EBEAE3] shrink-0 border border-[#DCDBCF]">
                        <Image
                          src={eq.images[0]}
                          alt={eq.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/equipment/${eq.id}`}
                          className="font-bold text-[#183C32] hover:underline block truncate max-w-xs"
                        >
                          {eq.title}
                        </Link>
                        <span className="text-[10px] text-[#8A948D]">
                          {eq.brand} • {eq.condition} • Qty: {eq.availableQuantity}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-[#183C32] block">{eq.ownerName}</span>
                    <span className="text-[10px] text-[#8A948D]">{eq.location}</span>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-[#202824]">{eq.category}</td>

                  <td className="py-3.5 px-4 font-heading font-extrabold text-sm text-[#183C32]">
                    ${eq.rentalPrice}/{eq.rentalType}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider ${
                        eq.status === "active"
                          ? "bg-green-100 text-green-800"
                          : eq.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {eq.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {eq.status !== "active" && (
                        <button
                          onClick={() => updateEquipmentStatus(eq.id, "active")}
                          className="px-2.5 py-1 bg-[#2E6B4F] hover:bg-[#245344] text-white text-[10px] font-bold uppercase rounded-xs transition-colors inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                          title="Approve & Publish Live"
                        >
                          <Check className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                      )}

                      {eq.status !== "rejected" && (
                        <button
                          onClick={() => updateEquipmentStatus(eq.id, "rejected")}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold uppercase rounded-xs transition-colors inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                          title="Reject listing"
                        >
                          <XIcon className="w-3 h-3" />
                          <span>Reject</span>
                        </button>
                      )}

                      <Link
                        href={`/equipment/${eq.id}`}
                        className="p-1 rounded-xs text-[#183C32] hover:bg-[#EBEAE3]"
                        title="View marketplace details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => {
                          if (confirm(`Delete listing ${eq.title}?`)) {
                            deleteEquipment(eq.id);
                          }
                        }}
                        className="p-1 rounded-xs text-red-600 hover:bg-red-50"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
