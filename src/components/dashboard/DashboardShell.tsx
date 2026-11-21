"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  Bookmark,
  User as UserIcon,
  PlusCircle,
  Wrench,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
  ChevronDown,
  Building2,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, currentRole, setCurrentRole, logout, favorites, bookings } = useApp();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Role-based navigation links
  const customerLinks = [
    { label: "My Rentals", href: "/dashboard/customer", icon: Truck },
    { label: "Favorites & Saved", href: "/dashboard/customer/favorites", icon: Bookmark, badge: favorites.length },
    { label: "Contractor Profile", href: "/dashboard/customer/profile", icon: UserIcon },
  ];

  const ownerLinks = [
    { label: "Fleet Overview", href: "/dashboard/owner", icon: LayoutDashboard },
    { label: "List New Equipment", href: "/dashboard/owner/add", icon: PlusCircle },
    { label: "My Fleet Listings", href: "/dashboard/owner/equipment", icon: Wrench },
    { label: "Incoming Rentals", href: "/dashboard/owner/rentals", icon: FileSpreadsheet, badge: bookings.length },
    { label: "Owner Profile", href: "/dashboard/owner/profile", icon: UserIcon },
  ];

  const adminLinks = [
    { label: "Platform Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "User Directory", href: "/dashboard/admin/users", icon: Users },
    { label: "Equipment Approvals", href: "/dashboard/admin/equipment", icon: ShieldCheck, badge: 6 },
    { label: "All Platform Rentals", href: "/dashboard/admin/rentals", icon: Truck },
    { label: "Admin Profile", href: "/dashboard/admin/profile", icon: UserIcon },
  ];

  const currentLinks =
    currentRole === "owner"
      ? ownerLinks
      : currentRole === "admin"
      ? adminLinks
      : customerLinks;

  const roleTitle =
    currentRole === "owner"
      ? "Fleet Owner Portal"
      : currentRole === "admin"
      ? "Platform Admin Console"
      : "Contractor Portal";

  const notifications = [
    {
      id: "notif-1",
      title: "Booking Mobilization Confirmed",
      desc: "CAT 320 GC excavator dispatch scheduled for tomorrow 7:30 AM.",
      time: "15 min ago",
      read: false,
    },
    {
      id: "notif-2",
      title: "Damage Waiver Verified",
      desc: "$2.5M commercial COI policy verified and active.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "notif-3",
      title: "Payout Received",
      desc: "Escrow disbursement of $3,250 processed to bank account.",
      time: "1 day ago",
      read: true,
    },
  ];

  return (
    <div className="min-h-screen flex bg-[#F7F6F1]">
      {/* Desktop Persistent Sidebar (260px) */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#11231D] text-[#ECEFEA] border-r border-[#1D3B31] shrink-0 sticky top-0 h-screen z-30">
        {/* Brand Area */}
        <div className="p-6 border-b border-[#1D3B31] flex items-center justify-between">
          <Link href="/" className="inline-flex items-baseline gap-1.5 focus:outline-hidden">
            <span className="font-heading font-extrabold text-2xl tracking-tight text-white">
              RENTORA
            </span>
            <span className="w-2 h-2 rounded-full bg-[#D99A42] inline-block" />
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-[#1A382F] text-[#D99A42] border border-[#234A3C]">
            {currentRole}
          </span>
        </div>

        {/* Current Active Persona Banner */}
        <div className="px-5 py-4 border-b border-[#1D3B31] bg-[#0E1E19]">
          <p className="text-[10px] uppercase font-bold tracking-widest text-[#7F8B83]">
            {roleTitle}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#183C32] shrink-0 border border-[#2A5243]">
              {currentUser?.avatarUrl ? (
                <Image
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              ) : (
                <Building2 className="w-4 h-4 m-2 text-[#D99A42]" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">
                {currentUser?.name || "Active Contractor"}
              </p>
              <p className="text-[11px] text-[#9AA39C] truncate">
                {currentUser?.email || "contractor@apexbuild.com"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-[10px] uppercase font-bold tracking-wider text-[#6A7B72] mb-2">
            Workspace Navigation
          </p>
          {currentLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/dashboard/customer" ||
              link.href === "/dashboard/owner" ||
              link.href === "/dashboard/admin"
                ? pathname === link.href
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-xs transition-colors ${
                  isActive
                    ? "bg-[#D99A42] text-[#11231D] shadow-xs"
                    : "text-[#C5CEC9] hover:bg-[#18342B] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </div>
                {typeof link.badge === "number" && link.badge > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? "bg-[#11231D] text-[#D99A42]"
                        : "bg-[#1D3B31] text-[#D99A42]"
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Return & Logout */}
        <div className="p-4 border-t border-[#1D3B31] space-y-2 bg-[#0E1E19]">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 text-xs text-[#9AA39C] hover:text-white rounded-xs hover:bg-[#18342B] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Back to Marketplace</span>
            </span>
          </Link>

          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#D14545] hover:bg-red-950/40 rounded-xs transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-[#E5E4DC] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
          {/* Left: Mobile Menu Trigger + Breadcrumb */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-[#202824] hover:bg-[#F7F6F1] rounded-xs"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Indicator */}
            <div className="flex items-center gap-1.5 text-xs text-[#6A726B]">
              <span className="font-semibold text-[#183C32] hidden sm:inline">{roleTitle}</span>
              <ChevronRight className="w-3.5 h-3.5 hidden sm:inline" />
              <span className="capitalize font-bold text-[#202824]">
                {pathname.split("/").pop() || "Overview"}
              </span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Live Role Switcher Pill (Dev only) or Role Badge (Prod) */}
            {process.env.NODE_ENV !== "production" ? (
              <div className="hidden sm:flex items-center text-xs bg-[#F7F6F1] border border-[#DCDBCF] rounded-full p-0.5">
                <span className="px-2.5 py-1 text-[#6A726B] font-semibold text-[10px] uppercase tracking-wider">
                  View:
                </span>
                {(["customer", "owner", "admin"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setCurrentRole(r);
                      router.push(`/dashboard/${r}`);
                    }}
                    className={`px-2.5 py-0.5 rounded-full font-semibold transition-all capitalize text-[11px] cursor-pointer ${
                      currentRole === r
                        ? "bg-[#183C32] text-white shadow-2xs"
                        : "text-[#555E57] hover:text-[#183C32]"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            ) : (
              <div className="hidden sm:flex items-center text-xs bg-[#F7F6F1] border border-[#DCDBCF] rounded-full px-3 py-1">
                <span className="text-[#6A726B] font-semibold text-[10px] uppercase tracking-wider mr-1.5">
                  Clearance:
                </span>
                <span className="font-bold text-[#183C32] capitalize text-xs">
                  {currentRole}
                </span>
              </div>
            )}

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-full text-[#4A544E] hover:text-[#183C32] hover:bg-[#F7F6F1] transition-colors"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D99A42]" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-sm shadow-xl border border-[#E5E4DC] p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-[#ECEBE3]">
                    <span className="text-xs font-bold text-[#183C32] uppercase tracking-wide">
                      Field Alerts &amp; Updates
                    </span>
                    <span className="text-[10px] text-[#D99A42] font-semibold">3 New</span>
                  </div>
                  <div className="divide-y divide-[#F7F6F1] py-1">
                    {notifications.map((n) => (
                      <div key={n.id} className="py-2.5 px-1 hover:bg-[#F7F6F1] rounded-xs cursor-pointer">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-[#183C32]">{n.title}</p>
                          <span className="text-[10px] text-[#8A948D]">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-[#555E57] mt-0.5">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full border border-[#DCDBCF] hover:border-[#183C32] transition-colors"
              >
                <div className="relative w-7 h-7 rounded-full overflow-hidden bg-[#183C32]">
                  {currentUser?.avatarUrl && (
                    <Image
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  )}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#6A726B] mr-1" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-sm shadow-xl border border-[#E5E4DC] py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#ECEBE3]">
                    <p className="text-xs font-bold text-[#183C32]">{currentUser?.name}</p>
                    <p className="text-[11px] text-[#6A726B] truncate">{currentUser?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href={`/dashboard/${currentRole}/profile`}
                      className="block px-4 py-1.5 text-xs text-[#202824] hover:bg-[#F7F6F1]"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profile &amp; Credentials
                    </Link>
                    <Link
                      href="/equipment"
                      className="block px-4 py-1.5 text-xs text-[#202824] hover:bg-[#F7F6F1]"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Browse Marketplace
                    </Link>
                  </div>
                  <div className="border-t border-[#ECEBE3] pt-1">
                    <button
                      onClick={() => {
                        logout();
                        router.push("/");
                      }}
                      className="w-full text-left px-4 py-1.5 text-xs text-red-600 hover:bg-red-50 font-semibold"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Main Workspace */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 lg:hidden flex">
          <div className="w-72 bg-[#11231D] text-[#ECEFEA] h-full flex flex-col justify-between p-6 animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#1D3B31]">
                <Link href="/" className="inline-flex items-baseline gap-1.5">
                  <span className="font-heading font-extrabold text-2xl text-white">
                    RENTORA
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#D99A42]" />
                </Link>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-[#8A948D] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Role Switcher in Drawer */}
              <div className="my-4 p-3 bg-[#0E1E19] rounded-xs border border-[#1D3B31] space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#D99A42]">
                  Switch Role
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["customer", "owner", "admin"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setCurrentRole(r);
                        setMobileSidebarOpen(false);
                        router.push(`/dashboard/${r}`);
                      }}
                      className={`py-1 text-center text-xs font-semibold rounded-xs capitalize ${
                        currentRole === r
                          ? "bg-[#D99A42] text-[#11231D]"
                          : "bg-[#18342B] text-white"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drawer Links */}
              <nav className="space-y-1">
                {currentLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xs ${
                        isActive
                          ? "bg-[#D99A42] text-[#11231D]"
                          : "text-[#C5CEC9] hover:bg-[#18342B]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#1D3B31]">
              <Link
                href="/"
                className="block py-2 text-xs text-[#8A948D] hover:text-white"
                onClick={() => setMobileSidebarOpen(false)}
              >
                Back to Public Marketplace
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
