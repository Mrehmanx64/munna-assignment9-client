"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Save,
  CheckCircle2,
  Building,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export function ProfileForm() {
  const { currentUser, currentRole, updateProfile } = useApp();

  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [address, setAddress] = useState(currentUser?.address || "");
  const [avatarUrl, setAvatarUrl] = useState(
    currentUser?.avatarUrl ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
  );
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
      setPhone(currentUser.phone || "");
      setAddress(currentUser.address || "");
      if (currentUser.avatarUrl) setAvatarUrl(currentUser.avatarUrl);
    }
  }, [currentUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProfile({
        name,
        phone,
        address,
        avatarUrl,
      });
    } catch {
      // Handled in context
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D99A42]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2E6B4F]" />
          <span>Account Verification &amp; Settings</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#183C32]">
          Organization &amp; Contractor Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#6A726B] mt-0.5">
          Manage your contact credentials, jobsite delivery dispatch points, and verified licensing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar Card & Verification Status */}
        <div className="bg-white p-6 rounded-sm border border-[#E5E4DC] shadow-2xs space-y-4 text-center">
          <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-[#EBEAE3] bg-[#183C32]">
            <Image
              src={avatarUrl}
              alt={name}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>

          <div>
            <h3 className="font-heading text-base font-bold text-[#183C32]">{name}</h3>
            <p className="text-xs text-[#6A726B] truncate">{email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs bg-[#183C32] text-white text-[10px] font-bold uppercase tracking-wider">
              <span>{currentRole}</span>
              <CheckCircle2 className="w-3 h-3 text-[#D99A42]" />
            </div>
          </div>

          <div className="pt-3 border-t border-[#ECEBE3] text-left text-xs space-y-2">
            <div className="flex items-center justify-between text-[#6A726B]">
              <span>ID Verification:</span>
              <span className="font-semibold text-[#2E6B4F]">Passed</span>
            </div>
            <div className="flex items-center justify-between text-[#6A726B]">
              <span>Commercial COI:</span>
              <span className="font-semibold text-[#2E6B4F]">$2.5M Active</span>
            </div>
            <div className="flex items-center justify-between text-[#6A726B]">
              <span>Member Since:</span>
              <span className="font-semibold text-[#202824]">{currentUser?.joinedDate || "2024"}</span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Editable Form */}
        <form
          onSubmit={handleSave}
          className="md:col-span-2 bg-white p-6 sm:p-8 rounded-sm border border-[#E5E4DC] shadow-2xs space-y-5"
        >
          <div className="border-b border-[#ECEBE3] pb-3">
            <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[#183C32]">
              General Contractor Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-name" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                Full Name / Legal Entity
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#8A948D] absolute left-3 top-3 pointer-events-none" />
                <input
                  id="profile-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="profile-email" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                Primary Contact Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8A948D] absolute left-3 top-3 pointer-events-none" />
                <input
                  id="profile-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32] focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-phone" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                Dispatch Phone Line
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#8A948D] absolute left-3 top-3 pointer-events-none" />
                <input
                  id="profile-phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="profile-avatar-url" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
                Avatar Image URL
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-[#8A948D] absolute left-3 top-3 pointer-events-none" />
                <input
                  id="profile-avatar-url"
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32] focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="profile-address" className="block text-[11px] font-bold uppercase tracking-wider text-[#6A726B] mb-1">
              Primary Office / Yard Address
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#8A948D] absolute left-3 top-3 pointer-events-none" />
              <input
                id="profile-address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#F7F6F1] border border-[#E0DFD6] rounded-xs text-[#202824] focus:outline-hidden focus:border-[#183C32] focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#ECEBE3] flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-[#183C32] hover:bg-[#245344] text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 text-[#D99A42]" />
              <span>{isSaving ? "Saving..." : "Save Profile Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
