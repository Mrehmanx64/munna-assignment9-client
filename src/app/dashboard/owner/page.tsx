"use client";

import React from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  Package,
  Wrench,
  CheckCircle2,
  Clock,
  PlusCircle,
  ArrowRight,
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
import { MOCK_OWNER_STATS } from "@/data/mockData";

export default function OwnerOverviewPage() {
  const { equipmentList, bookings } = useApp();

  const myEquipment = equipmentList.filter((e) => e.ownerId === "usr-owner-1" || true);
  const activeCount = myEquipment.filter((e) => e.status === "active").length;
  const pendingCount = myEquipment.filter((e) => e.status === "pending").length;

  const totalEarnings = MOCK_OWNER_STATS.totalEarnings;
  const monthlyEarnings = MOCK_OWNER_STATS.monthlyEarnings;

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
          <p className="font-heading text-xl sm:text-2xl font-extrabold text-[#183C32]">{myEquipment.length}</p>
          <span className="text-[10px] text-[#6A726B] mt-1 block">Units registered</span>
        </div>

        <div className="p-4 rounded-sm bg-white border border-[#E5E4DC] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#6A726B] mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Active Fleet</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B4F]" />
          </div>
          <p className="font-heading text-xl sm:text-2xl font-extrabold text-[#2E6B4F]">{activeCount}</p>
          <span className="text-[10px] text-[#2E6B4F] font-semibold mt-1 block">Live for rental</span>
        </div>

        <div className="p-4 rounded-sm bg-white border border-[#E5E4DC] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#6A726B] mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Pending Approval</span>
            <Clock className="w-3.5 h-3.5 text-[#D99A42]" />
          </div>
          <p className="font-heading text-xl sm:text-2xl font-extrabold text-[#D99A42]">{pendingCount || 1}</p>
          <span className="text-[10px] text-[#D99A42] mt-1 block">In safety audit</span>
        </div>

        <div className="p-4 rounded-sm bg-white border border-[#E5E4DC] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#6A726B] mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Completed Jobs</span>
            <Wrench className="w-3.5 h-3.5 text-[#183C32]" />
          </div>
          <p className="font-heading text-xl sm:text-2xl font-extrabold text-[#183C32]">46</p>
          <span className="text-[10px] text-[#6A726B] mt-1 block">100% deposit return</span>
        </div>

        <div className="p-4 rounded-sm bg-white border border-[#E5E4DC] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#6A726B] mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Total Revenue</span>
            <DollarSign className="w-3.5 h-3.5 text-[#183C32]" />
          </div>
          <p className="font-heading text-xl sm:text-2xl font-extrabold text-[#183C32]">
            ${totalEarnings.toLocaleString()}
          </p>
          <span className="text-[10px] text-[#2E6B4F] font-semibold mt-1 block">All-time escrow</span>
        </div>

        <div className="p-4 rounded-sm bg-white border border-[#E5E4DC] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#6A726B] mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">This Month</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#2E6B4F]" />
          </div>
          <p className="font-heading text-xl sm:text-2xl font-extrabold text-[#2E6B4F]">
            ${monthlyEarnings.toLocaleString()}
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
            <span className="text-xs font-semibold text-[#2E6B4F] bg-green-50 px-2.5 py-1 rounded-xs">
              +18.4% vs Last Month
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_OWNER_STATS.monthlyChart}>
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
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  formatter={(value: unknown) => [
                    `$${Number(value).toLocaleString()}`,
                    "Earnings",
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
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorEarnings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rental Activity Frequency Bar Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-sm border border-[#E5E4DC] shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#ECEBE3] pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D99A42]">
                Machine Mobilizations
              </span>
              <h2 className="font-heading text-base font-bold text-[#183C32]">
                Monthly Leases Dispatched
              </h2>
            </div>
            <span className="text-xs text-[#6A726B] font-mono">2024 YTD</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_OWNER_STATS.monthlyChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECEBE3" vertical={false} />
                <XAxis dataKey="month" stroke="#8A948D" fontSize={11} tickLine={false} />
                <YAxis stroke="#8A948D" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(value: unknown) => [`${value} Rentals`, "Volume"]}
                  contentStyle={{
                    backgroundColor: "#183C32",
                    borderColor: "#245344",
                    color: "#FFFFFF",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="rentals" fill="#D99A42" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Incoming Rentals Preview */}
      <div className="bg-white p-6 rounded-sm border border-[#E5E4DC] shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#ECEBE3] pb-3">
          <div>
            <h2 className="font-heading text-base font-bold text-[#183C32]">
              Recent Jobsite Dispatches
            </h2>
            <p className="text-xs text-[#6A726B]">
              Latest contractor bookings requiring mobilization confirmation or return sign-off.
            </p>
          </div>
          <Link
            href="/dashboard/owner/rentals"
            className="text-xs font-bold text-[#183C32] hover:underline inline-flex items-center gap-1"
          >
            <span>View All ({bookings.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EBEAE3] text-[#4A544E] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Contractor / Renter</th>
                <th className="py-2.5 px-3">Equipment</th>
                <th className="py-2.5 px-3">Period</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEBE3]">
              {bookings.slice(0, 4).map((bk) => (
                <tr key={bk.id} className="hover:bg-[#F7F6F1]">
                  <td className="py-3 px-3">
                    <p className="font-bold text-[#183C32]">{bk.customerName}</p>
                    <p className="text-[10px] text-[#6A726B]">{bk.customerEmail}</p>
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#202824]">
                    {bk.equipmentTitle}
                  </td>
                  <td className="py-3 px-3 text-[#555E57]">
                    {bk.startDate} ({bk.durationText})
                  </td>
                  <td className="py-3 px-3 font-heading font-extrabold text-[#183C32]">
                    ${bk.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider bg-[#183C32] text-white">
                      {bk.bookingStatus}
                    </span>
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
