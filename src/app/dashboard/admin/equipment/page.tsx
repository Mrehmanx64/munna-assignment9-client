"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ShieldCheck,
  Check,
  X as XIcon,
  Trash2,
  Eye,
  Search,
  Loader2,
  PackageOpen,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Equipment } from "@/types";
import { adminApi } from "@/lib/api";

export default function AdminEquipmentPage() {
  const queryClient = useQueryClient();
  const { equipmentList: contextList, updateEquipmentStatus, deleteEquipment } = useApp();
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Query live admin equipment
  const { data, isLoading } = useQuery({
    queryKey: ["admin-equipment"],
    queryFn: () => adminApi.getEquipment(),
    staleTime: 30000,
  });

  const liveList: Equipment[] = data?.equipment || [];
  const mergedMap = new Map<string, Equipment>();
  for (const eq of [...liveList, ...contextList]) {
    if (eq && eq.id && !mergedMap.has(eq.id)) {
      mergedMap.set(eq.id, eq);
    }
  }

  const equipmentList = Array.from(mergedMap.values());

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

  const handleApprove = async (id: string) => {
    await updateEquipmentStatus(id, "active");
    queryClient.invalidateQueries({ queryKey: ["admin-equipment"] });
    queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Enter rejection reason:", "Listing does not satisfy minimum commercial safety requirements.");
    if (reason === null) return;
    await updateEquipmentStatus(id, "rejected", reason);
    queryClient.invalidateQueries({ queryKey: ["admin-equipment"] });
    queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Delete listing "${title}" permanently?`)) {
      await deleteEquipment(id);
      queryClient.invalidateQueries({ queryKey: ["admin-equipment"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
    }
  };

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
      {isLoading ? (
        <div className="p-8 bg-white border border-[#E5E4DC] rounded-sm text-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#183C32] mx-auto mb-2" />
          <p className="text-xs text-[#6A726B]">Loading equipment catalogue for audit...</p>
        </div>
      ) : filtered.length > 0 ? (
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
                            src={eq.images[0] || "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80"}
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
                            onClick={() => handleApprove(eq.id)}
                            className="px-2.5 py-1 bg-[#2E6B4F] hover:bg-[#245344] text-white text-[10px] font-bold uppercase rounded-xs transition-colors inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                            title="Approve & Publish Live"
                          >
                            <Check className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                        )}

                        {eq.status !== "rejected" && (
                          <button
                            onClick={() => handleReject(eq.id)}
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
                          onClick={() => handleDelete(eq.id, eq.title)}
                          className="p-1 rounded-xs text-red-600 hover:bg-red-50 cursor-pointer"
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
      ) : (
        <div className="bg-white p-12 rounded-sm border border-[#E5E4DC] text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#EBEAE3] text-[#6A726B] flex items-center justify-center mx-auto">
            <PackageOpen className="w-7 h-7" />
          </div>
          <h3 className="font-heading text-lg font-bold text-[#183C32]">
            No equipment listings match this audit filter
          </h3>
          <p className="text-xs sm:text-sm text-[#6A726B] max-w-md mx-auto">
            All submitted machinery items have been audited and updated.
          </p>
        </div>
      )}
    </div>
  );
}
