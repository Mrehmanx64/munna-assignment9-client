"use client";

import React from "react";
import { AppProvider } from "@/context/AppContext";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            borderRadius: "6px",
            fontFamily: "var(--font-sans)",
          },
        }}
      />
    </AppProvider>
  );
}
