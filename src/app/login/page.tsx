"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  ArrowRight,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const { loginUser } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in both your email address and password.");
      return;
    }

    setIsLoading(true);

    try {
      // Auto-detect role or default customer
      let detectedRole: UserRole = "customer";
      if (email.includes("owner") || email.includes("marcus")) {
        detectedRole = "owner";
      } else if (email.includes("admin") || email.includes("elena")) {
        detectedRole = "admin";
      }

      const user = await loginUser(email, password, detectedRole);
      setIsLoading(false);
      toast.success("Signed in successfully to Rentora!");

      if (redirectUrl) {
        router.push(redirectUrl);
        return;
      }

      const roleToRoute = user?.role || detectedRole;
      if (roleToRoute === "owner") {
        router.push("/dashboard/owner");
      } else if (roleToRoute === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/customer");
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.response?.data?.message || err?.message || "Failed to sign in. Please verify credentials.");
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
              Sign In to Rentora
            </h1>
            <p className="text-xs sm:text-sm text-[#6A726B]">
              Enter your credentials to access your equipment rentals, fleet telemetry, or admin dashboard.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="login-email" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8A948D] absolute left-3 top-3 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contractor@domain.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-[#DCDBCF] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B]">
                  Password
                </label>
                <span className="text-[11px] text-[#183C32] hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8A948D] absolute left-3 top-3 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
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

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-[#525B55]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-xs text-[#183C32] border-[#DCDBCF] focus:ring-[#183C32]"
                />
                <span>Keep me signed in on this workstation</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#183C32] hover:bg-[#245344] text-[#F7F6F1] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? "Authenticating..." : "Sign In to Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#DCDBCF]" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-[#8A948D]">
                <span className="bg-[#F7F6F1] px-3">Or continue with</span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={async () => {
                toast.info("Google OAuth provider connected in sandbox mode");
                try {
                  await loginUser("alexander.hayes@apexbuild.com", "Password@1234", "customer");
                  if (redirectUrl) {
                    router.push(redirectUrl);
                  } else {
                    router.push("/dashboard/customer");
                  }
                } catch (err: any) {
                  toast.error(err?.message || "Google authentication failed");
                }
              }}
              className="w-full py-2.5 bg-white border border-[#DCDBCF] hover:bg-[#EBEAE3] text-[#202824] text-xs font-semibold rounded-xs transition-colors flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign In with Google</span>
            </button>
          </form>

          {/* Switch to Register */}
          <div className="pt-4 text-center text-xs text-[#6A726B]">
            Do not have a contractor account yet?{" "}
            <Link href="/register" className="font-bold text-[#183C32] hover:underline">
              Register New Organization
            </Link>
          </div>
        </div>

        {/* Bottom Legal Notice */}
        <div className="text-center text-[11px] text-[#8A948D]">
          Protected by Rentora 256-bit encryption. Terms of Rental &amp; Privacy Shield apply.
        </div>
      </div>

      {/* Right Editorial Photography Panel (5 cols) */}
      <div className="hidden lg:block lg:col-span-5 relative bg-[#11231D] text-white overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80"
          alt="CAT 320 GC excavator in civil construction"
          fill
          priority
          sizes="45vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#11231D] via-[#11231D]/70 to-transparent" />

        <div className="relative h-full flex flex-col justify-between p-12 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xs bg-[#1A382F] text-xs font-bold uppercase tracking-widest text-[#D99A42] border border-[#234A3C] self-start">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Industrial Equipment Escrow</span>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="font-heading text-3xl font-extrabold leading-tight">
                Right Equipment.
                <br />
                Right When You Need It.
              </h2>
              <p className="text-xs text-[#A8B5AE] leading-relaxed">
                Connect with vetted heavy equipment owners. Instant mobilization, verified service records, and zero paperwork bottlenecks.
              </p>
            </div>

            <div className="pt-4 border-t border-[#1F4336] space-y-2.5 text-xs text-[#ECEFEA]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D99A42]" />
                <span>$2.5M Commercial Site COI Included</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D99A42]" />
                <span>100% Inspected Machinery Telematics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D99A42]" />
                <span>24/7 Field Mechanic &amp; Dispatch Hotline</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#7F8B83]">
            © {new Date().getFullYear()} Rentora Inc. Heavy Machinery Network.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F6F1]" />}>
      <LoginForm />
    </Suspense>
  );
}
