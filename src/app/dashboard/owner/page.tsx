"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  DollarSign,
  TrendingUp,
  Package,
  Wrench,
  CheckCircle2,
  Clock,
  PlusCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useApp } from "@/context/AppContext";
import { ownerApi } from "@/lib/api";

export default function OwnerOverviewPage() {
  const { equipmentList } = useApp();

  // Live owner analytics overview query
  const { data: overview, isLoading: isOverviewLoading } = useQuery({
    queryKey: ["owner-analytics", "overview"],
    queryFn: () => ownerApi.getAnalyticsOverview(),
    staleTime: 60000,
  });

  // Live owner monthly earnings query
  const { data: monthlyData, isLoading: isMonthlyLoading } = useQuery({
    queryKey: ["owner-analytics", "monthly-earnings"],
    queryFn: () => ownerApi.getMonthlyEarnings(6),
    staleTime: 60000,
  });

  const myEquipment = equipmentList;
  const activeCount =
    overview?.activeListings ??
    myEquipment.filter((e) => e.status === "active").length;
  const pendingCount =
    overview?.pendingListings ??
    myEquipment.filter((e) => e.status === "pending").length;
  const totalFleetCount = overview?.totalEquipment ?? myEquipment.length;
  const totalCompleted = overview?.completedRentals ?? 0;
  const totalEarnings = overview?.totalEarnings ?? 0;

  // Compute monthly earnings: from real data if available, else 0
  const latestMonthEarnings =
    monthlyData && monthlyData.length > 0
      ? monthlyData[monthlyData.length - 1].earnings
      : 0;

  const defaultMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const chartData =
    monthlyData && monthlyData.length > 0
      ? monthlyData.map((m: any) => ({
          month: m.month,
          earnings: m.earnings || 0,
          rentals: m.rentalsCount || 0,
        }))
      : defaultMonths.map((month) => ({ month, earnings: 0, rentals: 0 }));

  const categoryCounts: Record<string, { total: number; available: number }> = {};
  for (const eq of myEquipment) {
    const cat = (eq.category || "General").split(" ")[0];
    if (!categoryCounts[cat]) categoryCounts[cat] = { total: 0, available: 0 };
    categoryCounts[cat].total += eq.totalQuantity || 1;
    categoryCounts[cat].available += eq.availableQuantity || 0;
  }

  const categoryEntries = Object.entries(categoryCounts);
  const utilizationData =
    categoryEntries.length > 0
      ? categoryEntries.map(([cat, counts]) => ({
          category: cat,
          rate: counts.total > 0 ? Math.round(((counts.total - counts.available) / counts.total) * 100) : 0,
        }))
      : [
          { category: "Construction", rate: 0 },
          { category: "Vehicles", rate: 0 },
          { category: "Photography", rate: 0 },
          { category: "Agriculture", rate: 0 },
        ];

  return (
    <div className="space-y-8">
      {/* Page Title & Fast Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D99A42]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Fleet Yield &amp; Analytics</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#183C32]">
            Fleet Owner Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#6A726B] mt-0.5">
            Monitor asset utilization, monthly revenue yields, and scheduled customer dispatches.
          </p>
        </div>

        <Link
          href="/dashboard/owner/add"
          className="px-4 py-2 bg-[#183C32] hover:bg-[#245344] text-[#F7F6F1] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-xs inline-flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-[#D99A42]" />
          <span>List New Machinery</span>
        </Link>
      </div>

      {/* 6 Key Operational Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-sm bg-white border border-[#E5E4DC] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#6A726B] mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Total Listed</span>
            <Package className="w-3.5 h-3.5 text-[#183C32]" />
          </div>
          <p className="font-heading text-xl sm:text-2xl font-extrabold text-[#183C32]">
            {isOverviewLoading ? (
              <span className="inline-block w-8 h-6 bg-[#E5E4DC] animate-pulse rounded-xs" />
            ) : (
              totalFleetCount
            )}
          </p>
          <span className="text-[10px] text-[#6A726B] mt-1 block">Units registered</span>
        </div>

        <div className="p-4 rounded-sm bg-white border border-[#E5E4DC] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#6A726B] mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Active Fleet</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B4F]" />
          </div>
          <p className="font-heading text-xl sm:text-2xl font-extrabold text-[#2E6B4F]">
            {isOverviewLoading ? (
              <span className="inline-block w-8 h-6 bg-[#E5E4DC] animate-pulse rounded-xs" />
            ) : (
              activeCount
            )}
          </p>
          <span className="text-[10px] text-[#2E6B4F] font-semibold mt-1 block">Live for rental</span>
        </div>

        <div className="p-4 rounded-sm bg-white border border-[#E5E4DC] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#6A726B] mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Pending Approval</span>
            <Clock className="w-3.5 h-3.5 text-[#D99A42]" />
          </div>
          <p className="font-heading text-xl sm:text-2xl font-extrabold text-[#D99A42]">
            {isOverviewLoading ? (
              <span className="inline-block w-8 h-6 bg-[#E5E4DC] animate-pulse rounded-xs" />
            ) : (
              pendingCount
            )}
          </p>
          <span className="text-[10px] text-[#D99A42] mt-1 block">In safety audit</span>
        </div>

        <div className="p-4 rounded-sm bg-white border border-[#E5E4DC] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#6A726B] mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Completed Jobs</span>
            <Wrench className="w-3.5 h-3.5 text-[#183C32]" />
          </div>
          <p className="font-heading text-xl sm:text-2xl font-extrabold text-[#183C32]">
            {isOverviewLoading ? (
              <span className="inline-block w-8 h-6 bg-[#E5E4DC] animate-pulse rounded-xs" />
            ) : (
              totalCompleted
            )}
          </p>
          <span className="text-[10px] text-[#6A726B] mt-1 block">100% deposit return</span>
        </div>

        <div className="p-4 rounded-sm bg-white border border-[#E5E4DC] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#6A726B] mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Total Revenue</span>
            <DollarSign className="w-3.5 h-3.5 text-[#183C32]" />
          </div>
          <p className="font-heading text-xl sm:text-2xl font-extrabold text-[#183C32]">
            {isOverviewLoading ? (
              <span className="inline-block w-14 h-6 bg-[#E5E4DC] animate-pulse rounded-xs" />
            ) : (
              `$${totalEarnings.toLocaleString()}`
            )}
          </p>
          <span className="text-[10px] text-[#2E6B4F] font-semibold mt-1 block">All-time escrow</span>
        </div>

        <div className="p-4 rounded-sm bg-white border border-[#E5E4DC] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#6A726B] mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">This Month</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#2E6B4F]" />
          </div>
          <p className="font-heading text-xl sm:text-2xl font-extrabold text-[#2E6B4F]">
            {isOverviewLoading ? (
              <span className="inline-block w-14 h-6 bg-[#E5E4DC] animate-pulse rounded-xs" />
            ) : (
              `$${latestMonthEarnings.toLocaleString()}`
            )}
          </p>
          <span className="text-[10px] text-[#2E6B4F] font-semibold mt-1 block">+18.4% growth</span>
        </div>
      </div>

      {/* Charts Row using Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Earnings Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-sm border border-[#E5E4DC] shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#ECEBE3] pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D99A42]">
                Revenue Analytics
              </span>
              <h2 className="font-heading text-base font-bold text-[#183C32]">
                Monthly Escrow Earnings ($ USD)
              </h2>
            </div>
            <span className="text-xs font-semibold text-[#2E6B4F] bg-green-50 px-2.5 py-1 rounded-xs flex items-center gap-1">
              {isMonthlyLoading && <Loader2 className="w-3 h-3 animate-spin" />}
              <span>Verified Ledger</span>
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
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
                  tickFormatter={(val) => (val >= 1000 ? `$${val / 1000}k` : `$${val}`)}
                />
                <Tooltip
                  formatter={(val: unknown) => [
                    `$${Number(val).toLocaleString()}`,
                    "Disbursed Earnings",
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
                  dataKey="earnings"
                  stroke="#183C32"
                  strokeWidth={2}
                  fill="url(#colorEarnings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Utilization Bar Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-sm border border-[#E5E4DC] shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#ECEBE3] pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D99A42]">
                Fleet Deployment
              </span>
              <h2 className="font-heading text-base font-bold text-[#183C32]">
                Utilization Rate (%)
              </h2>
            </div>
            <span className="text-xs font-semibold text-[#183C32]">Target: 80%</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECEBE3" vertical={false} />
                <XAxis dataKey="category" stroke="#8A948D" fontSize={10} tickLine={false} />
                <YAxis
                  stroke="#8A948D"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 100]}
                />
                <Tooltip
                  formatter={(v: unknown) => [`${v}%`, "Fleet Deployed"]}
                  contentStyle={{
                    backgroundColor: "#183C32",
                    borderColor: "#245344",
                    color: "#FFFFFF",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="rate" fill="#D99A42" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/owner/equipment"
          className="p-5 bg-white rounded-sm border border-[#E5E4DC] hover:border-[#183C32] transition-colors shadow-2xs group flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-bold uppercase text-[#D99A42]">Inventory</span>
            <h3 className="font-heading text-base font-bold text-[#183C32] group-hover:text-[#245344]">
              Manage Equipment Listings
            </h3>
            <p className="text-xs text-[#6A726B] mt-0.5">Edit machinery pricing, photos, and maintenance logs</p>
          </div>
          <ArrowRight className="w-5 h-5 text-[#8A948D] group-hover:text-[#183C32] transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/dashboard/owner/rentals"
          className="p-5 bg-white rounded-sm border border-[#E5E4DC] hover:border-[#183C32] transition-colors shadow-2xs group flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-bold uppercase text-[#D99A42]">Contracts</span>
            <h3 className="font-heading text-base font-bold text-[#183C32] group-hover:text-[#245344]">
              View Active Dispatches
            </h3>
            <p className="text-xs text-[#6A726B] mt-0.5">Approve incoming customer bookings and check payout schedules</p>
          </div>
          <ArrowRight className="w-5 h-5 text-[#8A948D] group-hover:text-[#183C32] transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
