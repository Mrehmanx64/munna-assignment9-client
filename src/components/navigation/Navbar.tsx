"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Menu,
  X,
  Search,
  Bookmark,
  ChevronDown,
  LayoutDashboard,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  PlusCircle,
  Truck,
  Wrench,
  UserPlus,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, currentRole, logout, favorites } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Explore Equipment", href: "/equipment" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "About", href: "/#why-us" },
    { label: "Contact", href: "/#contact" },
  ];

  const getDashboardHref = () => {
    if (currentRole === "owner") return "/dashboard/owner";
    if (currentRole === "admin") return "/dashboard/admin";
    return "/dashboard/customer";
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          isScrolled
            ? "bg-[#F7F6F1]/95 backdrop-blur-md shadow-xs border-b border-[#E5E4DC]"
            : "bg-[#F7F6F1] border-b border-[#ECEBE3]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <div className="flex items-center gap-8">
              <Link href="/" className="group flex items-baseline gap-1.5 focus:outline-hidden">
                <span className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-[#183C32]">
                  RENTORA
                </span>
                <span className="w-2 h-2 rounded-full bg-[#D99A42] transition-transform duration-300 group-hover:scale-125 inline-block" />
                <span className="hidden xl:inline-block ml-2 text-[10px] tracking-widest uppercase font-semibold text-[#6A726B] border-l border-[#DCDBCF] pl-2.5">
                  Heavy & Industrial
                </span>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden lg:flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href) && !link.href.includes("#");
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`px-3.5 py-2 text-sm font-medium transition-colors rounded-sm ${
                        isActive
                          ? "text-[#183C32] font-semibold bg-[#EBEAE3]/60"
                          : "text-[#4A524D] hover:text-[#183C32] hover:bg-[#EBEAE3]/40"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Search Shortcut */}
              <Link
                href="/equipment"
                className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full text-[#4A524D] hover:text-[#183C32] hover:bg-[#EBEAE3] transition-colors"
                title="Search Equipment"
              >
                <Search className="w-4 h-4" />
              </Link>

              {/* Favorites Shortcut (when logged in or guest) */}
              <Link
                href={currentRole === "guest" ? "/login" : "/dashboard/customer/favorites"}
                className="relative hidden sm:flex items-center justify-center w-9 h-9 rounded-full text-[#4A524D] hover:text-[#183C32] hover:bg-[#EBEAE3] transition-colors"
                title="Saved Equipment"
              >
                <Bookmark className="w-4 h-4" />
                {favorites.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D99A42]" />
                )}
              </Link>

              {/* User Dropdown or Guest Auth Buttons */}
              {currentUser ? (
                <div className="flex items-center gap-2">
                  {/* Quick Sign Up / Test New Account link visible even when logged in */}
                  <Link
                    href="/register"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#183C32] hover:text-[#245344] bg-[#EBEAE3] hover:bg-[#E0DED3] border border-[#DCDBCF] rounded-full transition-colors"
                    title="Test Sign Up / Create New Account"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-[#D99A42]" />
                    <span>Sign Up</span>
                  </Link>

                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-[#DCDBCF] bg-white hover:border-[#183C32] transition-colors focus:outline-hidden"
                    >
                      <div className="relative w-7 h-7 rounded-full overflow-hidden bg-[#183C32]">
                        <Image
                          src={currentUser.avatarUrl}
                          alt={currentUser.name}
                          fill
                          sizes="28px"
                          className="object-cover"
                        />
                      </div>
                      <span className="text-xs font-semibold text-[#183C32] hidden sm:inline max-w-[100px] truncate">
                        {currentUser.name.split(" ")[0]}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#6A726B]" />
                    </button>

                    {/* Dropdown Menu */}
                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-[#E5E4DC] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-4 py-2 border-b border-[#ECEBE3]">
                          <p className="text-sm font-semibold text-[#183C32]">{currentUser.name}</p>
                          <p className="text-xs text-[#6A726B] truncate">{currentUser.email}</p>
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-sm bg-[#183C32] text-[#F7F6F1]">
                              {currentUser.role}
                            </span>
                            <span className="text-[11px] text-[#6A726B]">Active Session</span>
                          </div>
                        </div>

                        <div className="py-1">
                          <Link
                            href={getDashboardHref()}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#202824] hover:bg-[#F7F6F1] font-medium"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <LayoutDashboard className="w-4 h-4 text-[#D99A42]" />
                            <span>Role Dashboard</span>
                          </Link>

                          {currentRole === "customer" && (
                            <>
                              <Link
                                href="/dashboard/customer"
                                className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#4A524D] hover:bg-[#F7F6F1]"
                                onClick={() => setUserDropdownOpen(false)}
                              >
                                <Truck className="w-4 h-4 text-[#6A726B]" />
                                <span>My Rentals</span>
                              </Link>
                              <Link
                                href="/dashboard/customer/favorites"
                                className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#4A524D] hover:bg-[#F7F6F1]"
                                onClick={() => setUserDropdownOpen(false)}
                              >
                                <Bookmark className="w-4 h-4 text-[#6A726B]" />
                                <span>Saved Gear ({favorites.length})</span>
                              </Link>
                            </>
                          )}

                          {currentRole === "owner" && (
                            <>
                              <Link
                                href="/dashboard/owner/add"
                                className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#4A524D] hover:bg-[#F7F6F1]"
                                onClick={() => setUserDropdownOpen(false)}
                              >
                                <PlusCircle className="w-4 h-4 text-[#6A726B]" />
                                <span>List New Equipment</span>
                              </Link>
                              <Link
                                href="/dashboard/owner/equipment"
                                className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#4A524D] hover:bg-[#F7F6F1]"
                                onClick={() => setUserDropdownOpen(false)}
                              >
                                <Wrench className="w-4 h-4 text-[#6A726B]" />
                                <span>Manage Listings</span>
                              </Link>
                            </>
                          )}

                          {currentRole === "admin" && (
                            <Link
                              href="/dashboard/admin/equipment"
                              className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#4A524D] hover:bg-[#F7F6F1]"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              <ShieldCheck className="w-4 h-4 text-[#6A726B]" />
                              <span>Approvals & Equipment</span>
                            </Link>
                          )}

                          <Link
                            href={`/dashboard/${currentRole}/profile`}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#4A524D] hover:bg-[#F7F6F1]"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <UserIcon className="w-4 h-4 text-[#6A726B]" />
                            <span>Profile Settings</span>
                          </Link>
                        </div>

                        {/* Direct testing and logout actions */}
                        <div className="border-t border-[#ECEBE3] pt-1">
                          <Link
                            href="/register"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#183C32] hover:bg-[#F7F6F1] font-semibold"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <UserPlus className="w-4 h-4 text-[#D99A42]" />
                            <span>Test New Registration</span>
                          </Link>
                          <button
                            onClick={() => {
                              logout();
                              setUserDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#B93838] hover:bg-red-50 text-left font-medium"
                          >
                            <LogOut className="w-4 h-4 text-[#B93838]" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#183C32] hover:bg-[#EBEAE3] rounded-sm transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold bg-[#183C32] text-[#F7F6F1] hover:bg-[#245344] rounded-sm transition-colors shadow-2xs"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-[#D99A42]" />
                    <span>Register</span>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[#202824] hover:bg-[#EBEAE3] rounded-sm transition-colors focus:outline-hidden"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#F7F6F1] border-b border-[#E5E4DC] px-4 pt-3 pb-6 animate-in slide-in-from-top-3 duration-200">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-3 py-2.5 text-base font-medium text-[#202824] hover:bg-[#EBEAE3] rounded-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {currentUser && (
                <div className="pt-2">
                  <Link
                    href={getDashboardHref()}
                    className="block w-full py-2.5 text-center font-semibold text-white bg-[#183C32] rounded-sm mb-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Go to {currentRole.toUpperCase()} Dashboard
                  </Link>
                </div>
              )}

              {/* ALWAYS accessible Sign In & Register buttons in mobile menu */}
              <div className="pt-2 border-t border-[#ECEBE3]">
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/login"
                    className="flex items-center justify-center py-2.5 text-center text-sm font-semibold border border-[#DCDBCF] bg-white rounded-sm text-[#183C32]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center gap-1.5 py-2.5 text-center text-sm font-bold bg-[#183C32] text-[#F7F6F1] rounded-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserPlus className="w-4 h-4 text-[#D99A42]" />
                    <span>Register</span>
                  </Link>
                </div>

                {currentUser && (
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="mt-2 w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-[#B93838] bg-red-50 hover:bg-red-100 rounded-sm"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out Current Account</span>
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
