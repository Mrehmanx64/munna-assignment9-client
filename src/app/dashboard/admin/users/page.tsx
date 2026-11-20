"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Users,
  Search,
  Building,
  Phone,
  Calendar,
  X,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { User, UserRole } from "@/types";

export default function AdminUsersPage() {
  const { users, updateUserRole } = useApp();
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filtered = users.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D99A42]">
            <Users className="w-3.5 h-3.5" />
            <span>Identity &amp; Role Governance</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#183C32]">
            User Directory &amp; Role Management
          </h1>
          <p className="text-xs sm:text-sm text-[#6A726B] mt-0.5">
            Audit registered contractor profiles, equipment owners, and assign administrative privileges.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-sm border border-[#E5E4DC] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "all", label: "All Users" },
            { id: "customer", label: "Contractors (Customers)" },
            { id: "owner", label: "Fleet Owners" },
            { id: "admin", label: "Administrators" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setRoleFilter(t.id)}
              className={`px-3 py-1.5 rounded-xs text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                roleFilter === t.id
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
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32]"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-sm border border-[#E5E4DC] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EBEAE3] border-b border-[#DCDBCF] text-[#4A544E] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">User / Organization</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Current Role</th>
                <th className="py-3 px-4">Member Since</th>
                <th className="py-3 px-4">Rental History</th>
                <th className="py-3 px-4 text-right">Assign Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEBE3]">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-[#F7F6F1] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#EBEAE3] shrink-0 border border-[#DCDBCF]">
                        <Image
                          src={user.avatarUrl}
                          alt={user.name}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="font-bold text-[#183C32] hover:underline block text-left"
                        >
                          {user.name}
                        </button>
                        <span className="text-[10px] text-[#8A948D]">{user.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-[#555E57]">{user.email}</td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-900"
                          : user.role === "owner"
                          ? "bg-amber-100 text-amber-900"
                          : "bg-green-100 text-green-900"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-[#6A726B] font-mono">{user.joinedDate}</td>

                  <td className="py-3.5 px-4 font-semibold text-[#183C32]">
                    {user.totalRentals || 0} completed
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                      className="text-[11px] font-bold px-2.5 py-1 rounded-xs bg-[#F7F6F1] border border-[#DCDBCF] text-[#183C32] cursor-pointer"
                    >
                      <option value="customer">Customer</option>
                      <option value="owner">Fleet Owner</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-sm border border-[#DCDBCF] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#ECEBE3] pb-3">
              <h3 className="font-heading text-base font-bold text-[#183C32]">
                User Credentials &amp; Verification
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 text-[#6A726B] hover:text-[#183C32]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-[#183C32]">
                <Image
                  src={selectedUser.avatarUrl}
                  alt={selectedUser.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-heading text-base font-bold text-[#183C32]">
                  {selectedUser.name}
                </h4>
                <p className="text-xs text-[#6A726B]">{selectedUser.email}</p>
                <span className="mt-1 inline-block px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider bg-[#183C32] text-white">
                  {selectedUser.role}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-2 border-t border-[#ECEBE3]">
              <div className="flex items-center gap-2 text-[#555E57]">
                <Phone className="w-3.5 h-3.5 text-[#8A948D]" />
                <span>{selectedUser.phone || "No phone listed"}</span>
              </div>
              <div className="flex items-center gap-2 text-[#555E57]">
                <Building className="w-3.5 h-3.5 text-[#8A948D]" />
                <span>{selectedUser.address || "No office address registered"}</span>
              </div>
              <div className="flex items-center gap-2 text-[#555E57]">
                <Calendar className="w-3.5 h-3.5 text-[#8A948D]" />
                <span>Joined: {selectedUser.joinedDate}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-[#183C32] text-white text-xs font-semibold rounded-xs"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
