"use client";

import React, { useState, useEffect } from "react";
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
  const { currentUser, currentRole, registerUser, loginWithGoogle } = useApp();

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

  useEffect(() => {
    if (currentUser && currentRole !== "guest") {
      router.replace(`/dashboard/${currentRole}`);
    }
  }, [currentUser, currentRole, router]);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || typeof window === "undefined") return;

    const handleGoogleCallback = async (response: any) => {
      try {
        if (!response.credential) {
          throw new Error("No Google authentication token received");
        }

        const user = await loginWithGoogle(response.credential);

        if (user) {
          toast.success(`Welcome to Rentora, ${user.name}!`);
          router.push(`/dashboard/${user.role}`);
        }
      } catch (err: any) {
        toast.error(err?.message || "Google sign-up failed");
      }
    };

    const scriptId = "google-gsi-client";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    const initGsi = () => {
      if ((window as any).google?.accounts?.id) {
        (window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCallback,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      }
    };

    if ((window as any).google?.accounts?.id) {
      initGsi();
    } else {
      script.addEventListener("load", initGsi);
    }
  }, [loginWithGoogle, router]);

  const handleGoogleClick = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      toast.error("Google Client ID is not configured");
      return;
    }

    if ((window as any).google?.accounts?.id) {
      (window as any).google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          toast.info("Please allow Google popups in your browser or select your account.");
        }
      });
    } else {
      toast.info("Initializing Google Sign-Up, please try again in a moment...");
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

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter.");
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
      // Register into AppContext & backend via authApi strictly as Customer
      const registered = await registerUser({
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: "customer",
        avatarUrl,
      });

      toast.success(`Account registered successfully! Welcome, ${registered.name}.`);
      router.push("/dashboard/customer");
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Role Badge */}
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-2">
                Account Type
              </span>
              <div className="p-3 bg-white border border-[#183C32] rounded-xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-[#183C32]" />
                  <div>
                    <span className="block text-xs font-bold text-[#183C32]">Contractor / Customer</span>
                    <span className="text-[10px] text-[#6A726B]">Full equipment discovery and rental privileges</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-green-50 text-green-800 border border-green-200">
                  Standard
                </span>
              </div>
              <p className="text-[10px] text-[#8A948D] mt-1.5">
                Note: Machinery Fleet Owner privileges require administrative commercial verification after registration.
              </p>
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

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#DCDBCF]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-[#8A948D]">
              <span className="bg-[#F7F6F1] px-3">Or sign up with</span>
            </div>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleClick}
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
            <span>Sign Up with Google</span>
          </button>

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
