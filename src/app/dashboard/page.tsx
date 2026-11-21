"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function DashboardIndexPage() {
  const router = useRouter();
  const { currentUser, currentRole } = useApp();

  useEffect(() => {
    if (!currentUser || currentRole === "guest") {
      router.replace("/login?redirect=/dashboard");
    } else if (currentRole === "owner") {
      router.replace("/dashboard/owner");
    } else if (currentRole === "admin") {
      router.replace("/dashboard/admin");
    } else {
      router.replace("/dashboard/customer");
    }
  }, [currentUser, currentRole, router]);

  return (
    <div className="flex items-center justify-center p-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#183C32]" />
    </div>
  );
}
