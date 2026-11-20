import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Youtube,
  Instagram,
  ArrowUpRight,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#11231D] text-[#ECEFEA] border-t border-[#1C362D] mt-auto">
      {/* Top Banner: Direct Equipment Support */}
      <div className="border-b border-[#1D3B31]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-sm bg-[#1A382F] flex items-center justify-center text-[#D99A42] shrink-0 border border-[#244C3F]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Verified Fleet Owners</p>
                <p className="text-xs text-[#98A39C]">All machinery inspected and certified</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-sm bg-[#1A382F] flex items-center justify-center text-[#D99A42] shrink-0 border border-[#244C3F]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Rapid Field Dispatch</p>
                <p className="text-xs text-[#98A39C]">Same-day delivery across regional hubs</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-sm bg-[#1A382F] flex items-center justify-center text-[#D99A42] shrink-0 border border-[#244C3F]">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">24/7 Site Support</p>
                <p className="text-xs text-[#98A39C]">Emergency mechanic & technical hotline</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-baseline gap-1.5 focus:outline-hidden">
              <span className="font-heading font-extrabold text-2xl tracking-tight text-white">
                RENTORA
              </span>
              <span className="w-2 h-2 rounded-full bg-[#D99A42] inline-block" />
            </Link>

            <p className="text-sm text-[#9AA39D] leading-relaxed max-w-sm">
              The premier industrial equipment marketplace. We connect general contractors, production studios, and commercial enterprises with vetted heavy machinery and high-precision tools.
            </p>

            <div className="pt-2 space-y-2 text-xs text-[#9AA39D]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D99A42]" />
                <span>1850 Industrial Parkway, Oakland, CA 94607</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D99A42]" />
                <span>+1 (800) 492-RENT (7368)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D99A42]" />
                <span>dispatch@rentora.com</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="pt-4 flex items-center gap-2.5">
              {/* X (formerly Twitter) Icon */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-sm bg-[#18342B] border border-[#23493C] flex items-center justify-center text-[#ECEFEA] hover:text-[#D99A42] hover:border-[#D99A42] transition-colors"
                aria-label="Follow us on X"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-sm bg-[#18342B] border border-[#23493C] flex items-center justify-center text-[#ECEFEA] hover:text-[#D99A42] hover:border-[#D99A42] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-sm bg-[#18342B] border border-[#23493C] flex items-center justify-center text-[#ECEFEA] hover:text-[#D99A42] hover:border-[#D99A42] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-sm bg-[#18342B] border border-[#23493C] flex items-center justify-center text-[#ECEFEA] hover:text-[#D99A42] hover:border-[#D99A42] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#D99A42] mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm text-[#9AA39D]">
              <li>
                <Link href="/equipment?category=Construction+Equipment" className="hover:text-white transition-colors">
                  Construction Machinery
                </Link>
              </li>
              <li>
                <Link href="/equipment?category=Photography+Equipment" className="hover:text-white transition-colors">
                  Cinema & Photography
                </Link>
              </li>
              <li>
                <Link href="/equipment?category=Vehicles+%26+Transportation" className="hover:text-white transition-colors">
                  Heavy Transport & Haulers
                </Link>
              </li>
              <li>
                <Link href="/equipment?category=Agriculture+Equipment" className="hover:text-white transition-colors">
                  Agricultural Equipment
                </Link>
              </li>
              <li>
                <Link href="/equipment?category=Electronics" className="hover:text-white transition-colors">
                  Power & LiDAR Electronics
                </Link>
              </li>
              <li>
                <Link href="/equipment?category=Event+Equipment" className="hover:text-white transition-colors">
                  Concert & Event Rigs
                </Link>
              </li>
            </ul>
          </div>

          {/* Marketplace Navigation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#D99A42] mb-4">
              Marketplace
            </h3>
            <ul className="space-y-2.5 text-sm text-[#9AA39D]">
              <li>
                <Link href="/equipment" className="hover:text-white transition-colors">
                  Explore All Equipment
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  How Rentals Work
                </Link>
              </li>
              <li>
                <Link href="/dashboard/owner/add" className="hover:text-white transition-colors inline-flex items-center gap-1 text-[#D99A42]">
                  <span>List Your Fleet</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/dashboard/customer" className="hover:text-white transition-colors">
                  Customer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Account Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#D99A42] mb-4">
              Trust & Security
            </h3>
            <ul className="space-y-2.5 text-sm text-[#9AA39D]">
              <li>
                <span className="text-white font-medium block">Standard Damage Waiver</span>
                <span className="text-xs text-[#7F8B83]">Comprehensive site coverage</span>
              </li>
              <li>
                <span className="text-white font-medium block">Contractor Escrow</span>
                <span className="text-xs text-[#7F8B83]">Funds protected until delivery</span>
              </li>
              <li>
                <span className="text-white font-medium block">Telematics Integration</span>
                <span className="text-xs text-[#7F8B83]">Real-time equipment monitoring</span>
              </li>
              <li>
                <span className="text-white font-medium block">Certified Operator Network</span>
                <span className="text-xs text-[#7F8B83]">OSHA & FAA compliance</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-[#1C362D] bg-[#0E1E19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7F8B83]">
          <p>© {new Date().getFullYear()} Rentora Inc. All rights reserved. Industrial Editorial Design System.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Rental</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Shield</span>
            <span className="hover:text-white cursor-pointer transition-colors">Equipment Standards</span>
            <span className="hover:text-white cursor-pointer transition-colors">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
