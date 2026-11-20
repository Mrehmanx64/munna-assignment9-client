"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Wrench,
  PlusCircle,
  Search,
  Trash2,
  PackageOpen,
  Eye,
  Loader2,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Equipment, EquipmentStatus } from "@/types";
import { ownerApi } from "@/lib/api";

export default function MyEquipmentListPage() {
  const { equipmentList: contextEquipment, deleteEquipment, updateEquipmentStatus } = useApp();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Query live owner equipment
  const { data, isLoading } = useQuery({
    queryKey: ["owner-equipment"],
    queryFn: () => ownerApi.getEquipment(),
    staleTime: 30000,
  });

  const liveList: Equipment[] = data?.equipment || [];
  const mergedMap = new Map<string, Equipment>();
  for (const eq of [...liveList, ...contextEquipment]) {
    if (eq && eq.id && !mergedMap.has(eq.id)) {
      mergedMap.set(eq.id, eq);
    }
  }

  const equipmentList = Array.from(mergedMap.values());

  const filtered = equipmentList.filter((eq) => {
    if (categoryFilter !== "All" && eq.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        eq.title.toLowerCase().includes(q) ||
        eq.brand.toLowerCase().includes(q) ||
        eq.model.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categories = [
    "All",
    "Construction Equipment",
    "Photography Equipment",
    "Vehicles & Transportation",
    "Agriculture Equipment",
    "Electronics",
    "Event Equipment",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D99A42]">
            <Wrench className="w-3.5 h-3.5" />
            <span>Active Inventory Management</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#183C32]">
            My Equipment Fleet
          </h1>
          <p className="text-xs sm:text-sm text-[#6A726B] mt-0.5">
            Manage your registered machinery, update operational status, and inspect catalog visibility.
          </p>
        </div>

        <Link
          href="/dashboard/owner/add"
          className="px-4 py-2 bg-[#183C32] hover:bg-[#245344] text-[#F7F6F1] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-xs inline-flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-[#D99A42]" />
          <span>Add New Equipment</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-sm border border-[#E5E4DC] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="owner-filter-category" className="text-xs font-bold text-[#6A726B] uppercase">Category:</label>
          <select
            id="owner-filter-category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs px-2.5 py-1.5 text-[#202824] cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-[#8A948D] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title, brand, or model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32]"
          />
        </div>
      </div>

      {/* Fleet Table */}
      {isLoading ? (
        <div className="p-8 bg-white border border-[#E5E4DC] rounded-sm text-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#183C32] mx-auto mb-2" />
          <p className="text-xs text-[#6A726B]">Loading owner machinery fleet...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="bg-white rounded-sm border border-[#E5E4DC] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EBEAE3] border-b border-[#DCDBCF] text-[#4A544E] uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Equipment &amp; Specs</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Rental Rate</th>
                  <th className="py-3 px-4">Fleet Stock</th>
                  <th className="py-3 px-4">Operational Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEBE3]">
                {filtered.map((eq) => (
                  <tr key={eq.id} className="hover:bg-[#F7F6F1] transition-colors">
                    {/* Equipment Info */}
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
                            {eq.brand} • {eq.model} • {eq.condition}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-[#202824]">{eq.category}</span>
                      <span className="text-[10px] text-[#8A948D] block">{eq.location}</span>
                    </td>

                    {/* Rental Price */}
                    <td className="py-3.5 px-4 font-heading font-extrabold text-sm text-[#183C32]">
                      ${eq.rentalPrice}
                      <span className="text-xs font-normal text-[#6A726B]">/{eq.rentalType}</span>
                    </td>

                    {/* Quantity Available */}
                    <td className="py-3.5 px-4 font-semibold text-[#202824]">
                      {eq.availableQuantity} of {eq.totalQuantity} units
                    </td>

                    {/* Status with interactive switcher */}
                    <td className="py-3.5 px-4">
                      <select
                        value={eq.status}
                        onChange={(e) =>
                          updateEquipmentStatus(eq.id, e.target.value as EquipmentStatus)
                        }
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-xs border cursor-pointer ${
                          eq.status === "active"
                            ? "bg-green-50 text-green-800 border-green-200"
                            : eq.status === "pending"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-gray-100 text-gray-800 border-gray-300"
                        }`}
                      >
                        <option value="active">Active (Live)</option>
                        <option value="pending">Pending Audit</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="rejected">Inactive</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/equipment/${eq.id}`}
                          className="p-1.5 rounded-xs text-[#183C32] hover:bg-[#EBEAE3] transition-colors"
                          title="View live marketplace page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${eq.title}?`)) {
                              deleteEquipment(eq.id);
                            }
                          }}
                          className="p-1.5 rounded-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete listing"
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
            No equipment listings match your filter
          </h3>
          <p className="text-xs sm:text-sm text-[#6A726B] max-w-md mx-auto">
            Add your machinery to the Rentora fleet network to begin receiving booking requisitions.
          </p>
          <Link
            href="/dashboard/owner/add"
            className="px-4 py-2 bg-[#183C32] hover:bg-[#245344] text-white text-xs font-semibold rounded-xs transition-colors shadow-2xs inline-block"
          >
            Add New Machinery
          </Link>
        </div>
      )}
    </div>
  );
}
