"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Package,
  TrendingUp,
  Clock,
  ShieldCheck,
  DollarSign,
  ArrowRight,
  PieChart as PieIcon,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useApp } from "@/context/AppContext";
import { adminApi } from "@/lib/api";

export default function AdminOverviewPage() {
  const { equipmentList } = useApp();

  // Live admin analytics overview
  const { data: overview, isLoading: isOverviewLoading } = useQuery({
    queryKey: ["admin-analytics", "overview"],
    queryFn: () => adminApi.getAnalyticsOverview(),
    staleTime: 60000,
  });

  // Live admin monthly revenue & volume metrics
  const { data: monthlyData, isLoading: isMonthlyLoading } = useQuery({
    queryKey: ["admin-analytics", "monthly-bookings"],
    queryFn: () => adminApi.getMonthlyBookings(6),
    staleTime: 60000,
  });

  const pendingApprovalsCount =
    overview?.pendingApprovals ??
    equipmentList.filter((e) => e.status === "pending").length ??
    0;

  const totalUsers = overview?.totalUsers ?? 0;
  const totalEquipment = overview?.totalEquipment ?? equipmentList.length;
  const activeFleetCount =
    overview?.approvedEquipment ??
    equipmentList.filter((e) => e.status === "active").length;
  const totalBookings = overview?.totalBookings ?? 0;
  const completedRentals = overview?.completedRentals ?? 0;
  const totalRevenue = overview?.totalRevenue ?? 0;

  // Chart data: prioritize real backend monthly data if available, else zero-filled months
  const defaultMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const chartData =
    monthlyData && monthlyData.length > 0
      ? monthlyData.map((m: any) => ({
          month: m.month,
          revenue: m.revenue || 0,
          bookings: m.bookingsCount || 0,
        }))
      : defaultMonths.map((m) => ({ month: m, revenue: 0, bookings: 0 }));

  // Dynamic category distribution computed from live catalog
  const catMap: Record<string, number> = {};
  for (const eq of equipmentList) {
    const cat = eq.category || "General";
    catMap[cat] = (catMap[cat] || 0) + 1;
  }
  const totalItems = equipmentList.length;
  const categoryDistribution =
    totalItems > 0
      ? Object.entries(catMap).map(([name, count]) => ({
          name,
          percentage: Math.round((count / totalItems) * 100),
          count,
        }))
      : [
          { name: "Construction Equipment", percentage: 0, count: 0 },
          { name: "Vehicles & Transportation", percentage: 0, count: 0 },
          { name: "Photography Equipment", percentage: 0, count: 0 },
          { name: "Agriculture Equipment", percentage: 0, count: 0 },
        ];

  const COLORS = ["#183C32", "#D99A42", "#2E6B4F", "#8B5E3C", "#555E57", "#3B82F6"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D99A42]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Master Administration Console</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#183C32]">
            Platform Governance &amp; Metrics
          </h1>
          <p className="text-xs sm:text-sm text-[#6A726B] mt-0.5">
            Oversee contractor onboarding, fleet quality certifications, escrow transactions, and marketplace health.
          </p>
        </div>

        <Link
          href="/dashboard/admin/equipment"
          className="px-4 py-2 bg-[#D99A42] hover:bg-[#C48733] text-[#11231D] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-xs inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <Clock className="w-4 h-4 text-[#11231D]" />
          <span>Audit Pending ({pendingApprovalsCount})</span>
        </Link>
      </div>

      {/* 6 Key Admin Analytics KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-sm bg-white border border-[#E5E4DC] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#6A726B] mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Total Users</span>
            <Users className="w-3.5 h-3.5 text-[#183C32]" />
          </div>
          <p className="font-heading text-xl sm:text-2xl font-extrabold text-[#183C32]">
            {isOverviewLoading ? (
              <span className="inline-block w-12 h-6 bg-[#E5E4DC] animate-pulse rounded-xs" />
            ) : (
              totalUsers.toLocaleString()
            )}
          </p>
          <span className="text-[10px] text-[#2E6B4F] font-semibold mt-1 block">Contractors &amp; Owners</span>
        </div>

        <div className="p-4 rounded-sm bg-white border border-[#E5E4DC] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#6A726B] mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Total Fleet</span>
            <Package className="w-3.5 h-3.5 text-[#183C32]" />
          </div>
          <p className="font-heading text-xl sm:text-2xl font-extrabold text-[#183C32]">
            {isOverviewLoading ? (
              <span className="inline-block w-12 h-6 bg-[#E5E4DC] animate-pulse rounded-xs" />
            ) : (
              `${totalEquipment} Units`
            )}
          </p>
          <span className="text-[10px] text-[#2E6B4F] font-semibold mt-1 block">
            {activeFleetCount} Verified Live
          </span>
        </div>

        <div className="p-4 rounded-sm bg-white border border-[#E5E4DC] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#6A726B] mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Total Leases</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#2E6B4F]" />
          </div>
          <p className="font-heading text-xl sm:text-2xl font-extrabold text-[#183C32]">
            {isOverviewLoading ? (
              <span className="inline-block w-12 h-6 bg-[#E5E4DC] animate-pulse rounded-xs" />
            ) : (
              totalBookings
            )}
          </p>
          <span className="text-[10px] text-[#2E6B4F] font-semibold mt-1 block">Platform Bookings</span>
        </div>

        <div className="p-4 rounded-sm bg-white border border-[#E5E4DC] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#6A726B] mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Pending Audit</span>
            <Clock className="w-3.5 h-3.5 text-[#D99A42]" />
          </div>
          <p className="font-heading text-xl sm:text-2xl font-extrabold text-[#D99A42]">
            {isOverviewLoading ? (
              <span className="inline-block w-12 h-6 bg-[#E5E4DC] animate-pulse rounded-xs" />
            ) : (
              pendingApprovalsCount
            )}
          </p>
          <span className="text-[10px] text-[#D99A42] font-semibold mt-1 block">Requires action</span>
        </div>

        <div className="p-4 rounded-sm bg-white border border-[#E5E4DC] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#6A726B] mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Completed</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B4F]" />
          </div>
          <p className="font-heading text-xl sm:text-2xl font-extrabold text-[#2E6B4F]">
            {isOverviewLoading ? (
              <span className="inline-block w-12 h-6 bg-[#E5E4DC] animate-pulse rounded-xs" />
            ) : (
              completedRentals
            )}
          </p>
          <span className="text-[10px] text-[#6A726B] mt-1 block">Passed inspection</span>
        </div>

        <div className="p-4 rounded-sm bg-white border border-[#E5E4DC] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#6A726B] mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Total GMV</span>
            <DollarSign className="w-3.5 h-3.5 text-[#183C32]" />
          </div>
          <p className="font-heading text-xl sm:text-2xl font-extrabold text-[#183C32]">
            {isOverviewLoading ? (
              <span className="inline-block w-12 h-6 bg-[#E5E4DC] animate-pulse rounded-xs" />
            ) : (
              `$${totalRevenue.toLocaleString()}`
            )}
          </p>
          <span className="text-[10px] text-[#2E6B4F] font-semibold mt-1 block">Escrow GMV</span>
        </div>
      </div>

      {/* Recharts Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Revenue Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-sm border border-[#E5E4DC] shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#ECEBE3] pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D99A42]">
                Platform Escrow GMV
              </span>
              <h2 className="font-heading text-base font-bold text-[#183C32]">
                Monthly Requisition Volume ($ USD)
              </h2>
            </div>
            <span className="text-xs font-semibold text-[#2E6B4F] bg-green-50 px-2.5 py-1 rounded-xs flex items-center gap-1">
              {isMonthlyLoading && <Loader2 className="w-3 h-3 animate-spin" />}
              <span>Live Escrow Feed</span>
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="adminColorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#183C32" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#183C32" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECEBE3" vertical={false} />
                <XAxis dataKey="month" stroke="#8A948D" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#8A948D"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => (v >= 1000 ? `$${v / 1000}k` : `$${v}`)}
                />
                <Tooltip
                  formatter={(val: unknown) => [
                    `$${Number(val).toLocaleString()}`,
                    "Platform GMV",
                  ]}
                  contentStyle={{
                    backgroundColor: "#183C32",
                    borderColor: "#245344",
                    color: "#FFFFFF",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#183C32"
                  strokeWidth={2.5}
                  fill="url(#adminColorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Equipment Category Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-sm border border-[#E5E4DC] shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#ECEBE3] pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D99A42]">
                Asset Diversification
              </span>
              <h2 className="font-heading text-base font-bold text-[#183C32]">
                Category Distribution (%)
              </h2>
            </div>
            <PieIcon className="w-4 h-4 text-[#D99A42]" />
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  dataKey="percentage"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={45}
                  paddingAngle={3}
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: unknown) => [`${val}%`, "Fleet Share"]}
                  contentStyle={{
                    backgroundColor: "#183C32",
                    borderColor: "#245344",
                    color: "#FFFFFF",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            {categoryDistribution.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-2xs shrink-0"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="text-[#555E57] truncate">{item.name}</span>
                <span className="font-bold text-[#183C32] ml-auto">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Navigation to Admin Sub-Tables */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/dashboard/admin/equipment"
          className="p-5 bg-white rounded-sm border border-[#E5E4DC] hover:border-[#183C32] transition-colors shadow-2xs group flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-bold uppercase text-[#D99A42]">Fleet Governance</span>
            <h3 className="font-heading text-base font-bold text-[#183C32] group-hover:text-[#245344]">
              Review Equipment Listings
            </h3>
            <p className="text-xs text-[#6A726B] mt-0.5">Approve or reject newly submitted contractor fleet</p>
          </div>
          <ArrowRight className="w-5 h-5 text-[#8A948D] group-hover:text-[#183C32] transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/dashboard/admin/users"
          className="p-5 bg-white rounded-sm border border-[#E5E4DC] hover:border-[#183C32] transition-colors shadow-2xs group flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-bold uppercase text-[#D99A42]">User Management</span>
            <h3 className="font-heading text-base font-bold text-[#183C32] group-hover:text-[#245344]">
              Manage Registered Users
            </h3>
            <p className="text-xs text-[#6A726B] mt-0.5">Assign roles (customer, owner, admin) and inspect credentials</p>
          </div>
          <ArrowRight className="w-5 h-5 text-[#8A948D] group-hover:text-[#183C32] transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/dashboard/admin/rentals"
          className="p-5 bg-white rounded-sm border border-[#E5E4DC] hover:border-[#183C32] transition-colors shadow-2xs group flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-bold uppercase text-[#D99A42]">Escrow Ledger</span>
            <h3 className="font-heading text-base font-bold text-[#183C32] group-hover:text-[#245344]">
              Inspect All Platform Leases
            </h3>
            <p className="text-xs text-[#6A726B] mt-0.5">Monitor contractor-to-owner contracts and payout status</p>
          </div>
          <ArrowRight className="w-5 h-5 text-[#8A948D] group-hover:text-[#183C32] transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
