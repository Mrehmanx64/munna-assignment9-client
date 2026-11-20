"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Search,
  Building,
  Phone,
  Calendar,
  X,
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import { User, UserRole } from "@/types";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { currentUser } = useApp();

  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch users with search, role, and pagination
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["admin-users", { role: roleFilter, search: debouncedSearch, page, limit }],
    queryFn: async () => {
      const params: any = { page, limit };
      if (roleFilter !== "all") params.role = roleFilter;
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      return adminApi.getUsers(params);
    },
    staleTime: 30000,
  });

  const users: User[] = data?.users || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  // Role update mutation
  const roleMutation = useMutation({
    mutationFn: async ({ id, newRole }: { id: string; newRole: UserRole }) => {
      return adminApi.updateUserRole(id, newRole);
    },
    onSuccess: (updatedUser, variables) => {
      toast.success(`Role for ${updatedUser.name} updated to ${variables.newRole.toUpperCase()}`);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || "Failed to update user role";
      toast.error(msg);
    },
  });

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    if (currentUser?.id === userId && newRole !== "admin") {
      toast.error("Self-demotion protection: You cannot remove your own admin access.");
      return;
    }
    roleMutation.mutate({ id: userId, newRole });
  };

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
              onClick={() => {
                setRoleFilter(t.id);
                setPage(1);
              }}
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
          {isFetching && (
            <Loader2 className="w-3.5 h-3.5 text-[#8A948D] absolute right-3 top-2.5 animate-spin" />
          )}
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-sm flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-red-700">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>
              Failed to load user directory: {(error as any)?.message || "Internal server error"}
            </span>
          </div>
          <button
            onClick={() => refetch()}
            className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-xs hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

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
              {isLoading ? (
                // Loading Skeleton Rows
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#E5E4DC]" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-28 bg-[#E5E4DC] rounded-xs" />
                          <div className="h-2.5 w-16 bg-[#E5E4DC] rounded-xs" />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-3 w-36 bg-[#E5E4DC] rounded-xs" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-4 w-16 bg-[#E5E4DC] rounded-xs" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-3 w-20 bg-[#E5E4DC] rounded-xs" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-3 w-16 bg-[#E5E4DC] rounded-xs" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="h-6 w-24 bg-[#E5E4DC] rounded-xs ml-auto" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="max-w-sm mx-auto space-y-2">
                      <Users className="w-8 h-8 text-[#8A948D] mx-auto opacity-60" />
                      <p className="font-heading text-sm font-bold text-[#183C32]">
                        No matching users found
                      </p>
                      <p className="text-xs text-[#6A726B]">
                        {debouncedSearch
                          ? `No user records matching "${debouncedSearch}". Try a different keyword.`
                          : "No users currently match this role filter."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Populated Rows
                users.map((user) => {
                  const isCurrentAdmin = currentUser?.id === user.id || currentUser?.email === user.email;
                  return (
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
                        {isCurrentAdmin && (
                          <span className="ml-1.5 text-[9px] font-semibold text-[#183C32] bg-[#EBEAE3] px-1.5 py-0.5 rounded-2xs">
                            (You)
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-[#6A726B] font-mono">{user.joinedDate}</td>

                      <td className="py-3.5 px-4 font-semibold text-[#183C32]">
                        {user.totalRentals || 0} completed
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <select
                          value={user.role}
                          disabled={roleMutation.isPending}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                          className="text-[11px] font-bold px-2.5 py-1 rounded-xs bg-[#F7F6F1] border border-[#DCDBCF] text-[#183C32] cursor-pointer disabled:opacity-50"
                        >
                          <option value="customer">Customer</option>
                          <option value="owner">Fleet Owner</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {meta.totalPages > 1 && (
          <div className="p-3 bg-[#F7F6F1] border-t border-[#DCDBCF] flex items-center justify-between text-xs text-[#6A726B]">
            <div>
              Showing page <span className="font-bold text-[#183C32]">{meta.page}</span> of{" "}
              <span className="font-bold text-[#183C32]">{meta.totalPages}</span> ({meta.total} total users)
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isFetching}
                className="px-2.5 py-1 bg-white border border-[#DCDBCF] rounded-xs font-semibold text-[#183C32] hover:bg-[#EBEAE3] disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page >= meta.totalPages || isFetching}
                className="px-2.5 py-1 bg-white border border-[#DCDBCF] rounded-xs font-semibold text-[#183C32] hover:bg-[#EBEAE3] disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
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
