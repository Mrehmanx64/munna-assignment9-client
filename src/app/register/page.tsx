"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  User as UserIcon,
  Image as ImageIcon,
  ArrowRight,
  Briefcase,
  Wrench,
  AlertCircle,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = useApp();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const [avatarUrl, setAvatarUrl] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fillQuickDemo = (demoRole: UserRole) => {
    if (demoRole === "customer") {
      setFullName("Devin Vance");
      setEmail(`devin.${Date.now().toString().slice(-4)}@apexrenter.com`);
      setRole("customer");
      setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80");
      setPassword("Pass@12345");
      setConfirmPassword("Pass@12345");
      setTermsAgreed(true);
      setError(null);
    } else {
      setFullName("Valerie Sterling");
      setEmail(`valerie.${Date.now().toString().slice(-4)}@sterlingheavy.com`);
      setRole("owner");
      setAvatarUrl("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80");
      setPassword("Pass@12345");
      setConfirmPassword("Pass@12345");
      setTermsAgreed(true);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !password) {
      setError("Please fill in all mandatory registration fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters in length.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and confirmation password do not match.");
      return;
    }

    if (!termsAgreed) {
      setError("You must accept the Rentora Terms of Service to create an account.");
      return;
    }

    setIsLoading(true);

    try {
      // Optional call to backend if server is running
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/auth/register`
          : "http://localhost:5000/api/auth/register";
        await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fullName.trim(),
            email: email.trim().toLowerCase(),
            password,
            role,
          }),
          signal: controller.signal,
        });
      } catch {
        // Fallback gracefully if server is offline or slower than 1.5s
      } finally {
        clearTimeout(timeoutId);
      }

      // Register into AppContext & persistent store
      const registered = registerUser({
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        role,
        avatarUrl,
      });

      toast.success(`Account registered successfully as ${role.toUpperCase()}! Welcome, ${registered.name}.`);
      if (role === "owner") {
        router.push("/dashboard/owner");
      } else {
        router.push("/dashboard/customer");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to register account.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F7F6F1]">
      {/* Left Form Area (7 cols) */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        <div>
          {/* Brand Logo */}
          <Link href="/" className="inline-flex items-baseline gap-1.5 focus:outline-hidden">
            <span className="font-heading font-extrabold text-2xl tracking-tight text-[#183C32]">
              RENTORA
            </span>
            <span className="w-2 h-2 rounded-full bg-[#D99A42] inline-block" />
          </Link>
        </div>

        {/* Form Container */}
        <div className="max-w-md w-full mx-auto my-8 space-y-6">
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-extrabold text-[#183C32] tracking-tight">
              Create an Account
            </h1>
            <p className="text-xs sm:text-sm text-[#6A726B]">
              Join Rentora to rent industrial machinery or list your commercial fleet for verified contractors.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Autofill Bar for Instant Testing */}
          <div className="bg-[#EBEAE3] p-2.5 rounded-xs border border-[#DCDBCF] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <span className="text-[11px] font-semibold text-[#525B55]">Testing shortcuts:</span>
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => fillQuickDemo("customer")}
                className="flex-1 sm:flex-initial px-2.5 py-1 text-[11px] font-semibold bg-white border border-[#DCDBCF] hover:border-[#183C32] text-[#183C32] rounded-xs transition-colors cursor-pointer"
              >
                Auto-fill Customer
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo("owner")}
                className="flex-1 sm:flex-initial px-2.5 py-1 text-[11px] font-semibold bg-white border border-[#DCDBCF] hover:border-[#183C32] text-[#183C32] rounded-xs transition-colors cursor-pointer"
              >
                Auto-fill Owner
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Role Selection */}
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-2">
                Account Type
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className={`p-3 rounded-xs border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    role === "customer"
                      ? "bg-white border-[#183C32] ring-2 ring-[#183C32]/20"
                      : "bg-[#F7F6F1] border-[#DCDBCF] hover:bg-white"
                  }`}
                >
                  <Briefcase className={`w-4 h-4 mt-0.5 ${role === "customer" ? "text-[#183C32]" : "text-[#8A948D]"}`} />
                  <div>
                    <span className="block text-xs font-bold text-[#183C32]">Customer</span>
                    <span className="text-[10px] text-[#6A726B]">Rent equipment</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("owner")}
                  className={`p-3 rounded-xs border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    role === "owner"
                      ? "bg-white border-[#183C32] ring-2 ring-[#183C32]/20"
                      : "bg-[#F7F6F1] border-[#DCDBCF] hover:bg-white"
                  }`}
                >
                  <Wrench className={`w-4 h-4 mt-0.5 ${role === "owner" ? "text-[#D99A42]" : "text-[#8A948D]"}`} />
                  <div>
                    <span className="block text-xs font-bold text-[#183C32]">Fleet Owner</span>
                    <span className="text-[10px] text-[#6A726B]">List &amp; earn</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="reg-fullname" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1.5">
                Full Name / Organization Lead
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#8A948D] absolute left-3 top-3 pointer-events-none" />
                <input
                  id="reg-fullname"
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-[#DCDBCF] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32]"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="reg-email" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8A948D] absolute left-3 top-3 pointer-events-none" />
                <input
                  id="reg-email"
                  type="email"
                  required
                  placeholder="sarah@constructcorp.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-[#DCDBCF] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32]"
                />
              </div>
            </div>

            {/* Profile Image URL with live preview */}
            <div>
              <label htmlFor="reg-avatar" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1.5">
                Profile Image URL
              </label>
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#EAE8DE] shrink-0 border border-[#DCDBCF]">
                  <Image
                    src={avatarUrl}
                    alt="Avatar preview"
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="relative flex-1">
                  <ImageIcon className="w-4 h-4 text-[#8A948D] absolute left-3 top-3 pointer-events-none" />
                  <input
                    id="reg-avatar"
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#DCDBCF] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32]"
                  />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="reg-password" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8A948D] absolute left-3 top-3 pointer-events-none" />
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 text-xs bg-white border border-[#DCDBCF] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#8A948D] hover:text-[#183C32]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="reg-confirm-password" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8A948D] absolute left-3 top-3 pointer-events-none" />
                <input
                  id="reg-confirm-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-[#DCDBCF] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32]"
                />
              </div>
            </div>

            {/* Terms Agreement Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2 text-xs text-[#525B55] cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="w-4 h-4 rounded-xs text-[#183C32] border-[#DCDBCF] focus:ring-[#183C32] mt-0.5"
                />
                <span>
                  I agree to the Rentora Master Terms of Rental, Commercial Equipment Waiver, and Privacy Guidelines.
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#183C32] hover:bg-[#245344] text-[#F7F6F1] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? "Creating Account..." : "Create Rentora Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch to Login */}
          <div className="pt-3 text-center text-xs text-[#6A726B]">
            Already have an active account?{" "}
            <Link href="/login" className="font-bold text-[#183C32] hover:underline">
              Sign In Here
            </Link>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="text-center text-[11px] text-[#8A948D]">
          Protected by Rentora 256-bit encryption. Terms of Rental &amp; Privacy Shield apply.
        </div>
      </div>

      {/* Right Editorial Panel (5 cols) */}
      <div className="hidden lg:block lg:col-span-5 relative bg-[#11231D] text-white overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80"
          alt="Cinema large format camera kit"
          fill
          priority
          sizes="45vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#11231D] via-[#11231D]/70 to-transparent" />

        <div className="relative h-full flex flex-col justify-between p-12 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xs bg-[#1A382F] text-xs font-bold uppercase tracking-widest text-[#D99A42] border border-[#234A3C] self-start">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Commercial Contractor Escrow</span>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="font-heading text-3xl font-extrabold leading-tight">
                Built for High-Yield Operations.
              </h2>
              <p className="text-xs text-[#A8B5AE] leading-relaxed">
                Whether sourcing 20-ton excavators for infrastructure works or renting out high-end optics to Hollywood productions, Rentora safeguards every transaction.
              </p>
            </div>

            <div className="pt-4 border-t border-[#1F4336] space-y-2.5 text-xs text-[#ECEFEA]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D99A42]" />
                <span>Zero Listing Fees for Verified Machinery Owners</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D99A42]" />
                <span>Instant COI Verification &amp; Identity Audit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D99A42]" />
                <span>Direct Telematics &amp; Mobilization Scheduling</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#7F8B83]">
            © {new Date().getFullYear()} Rentora Inc. Equipment Network.
          </div>
        </div>
      </div>
    </div>
  );
}
