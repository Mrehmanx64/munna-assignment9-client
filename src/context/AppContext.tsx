"use client";

import React, { createContext, useContext, useState } from "react";
import {
  Equipment,
  RentalBooking,
  User,
  UserRole,
} from "@/types";
import {
  MOCK_EQUIPMENT,
  MOCK_BOOKINGS,
  MOCK_USERS,
} from "@/data/mockData";
import { toast } from "sonner";

interface AppContextType {
  currentUser: User | null;
  currentRole: UserRole | "guest";
  setCurrentRole: (role: UserRole | "guest") => void;
  favorites: string[];
  toggleFavorite: (equipmentId: string) => void;
  isFavorite: (equipmentId: string) => boolean;
  equipmentList: Equipment[];
  addEquipment: (equipment: Omit<Equipment, "id" | "createdAt" | "rating" | "reviewCount">) => void;
  updateEquipmentStatus: (id: string, status: Equipment["status"]) => void;
  deleteEquipment: (id: string) => void;
  bookings: RentalBooking[];
  addBooking: (booking: Omit<RentalBooking, "id" | "createdAt">) => void;
  updateBookingStatus: (id: string, status: RentalBooking["bookingStatus"]) => void;
  updatePaymentStatus: (id: string, status: RentalBooking["paymentStatus"]) => void;
  users: User[];
  updateUserRole: (userId: string, newRole: UserRole) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setRoleState] = useState<UserRole | "guest">(() => {
    if (typeof window !== "undefined") {
      try {
        const savedRole = localStorage.getItem("rentora_role") as UserRole | "guest" | null;
        if (savedRole) return savedRole;
      } catch {
        // Ignore
      }
    }
    return "customer";
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedFavorites = localStorage.getItem("rentora_favorites");
        if (savedFavorites) return JSON.parse(savedFavorites);
      } catch {
        // Ignore
      }
    }
    return ["eq-1", "eq-2"];
  });

  const [equipmentList, setEquipmentList] = useState<Equipment[]>(MOCK_EQUIPMENT);
  const [bookings, setBookings] = useState<RentalBooking[]>(MOCK_BOOKINGS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  const setCurrentRole = (role: UserRole | "guest") => {
    setRoleState(role);
    try {
      localStorage.setItem("rentora_role", role);
    } catch {
      // Ignore storage errors
    }
    if (role === "guest") {
      toast.info("Switched to Guest mode (logged out)");
    } else {
      const u = users.find((usr) => usr.role === role);
      toast.success(`Switched active view to ${role.toUpperCase()}: ${u?.name || role}`);
    }
  };

  const currentUser = currentRole === "guest"
    ? null
    : users.find((u) => u.role === currentRole) || users[0];

  const toggleFavorite = (equipmentId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(equipmentId);
      const next = exists ? prev.filter((id) => id !== equipmentId) : [...prev, equipmentId];
      try {
        localStorage.setItem("rentora_favorites", JSON.stringify(next));
      } catch {
        // Ignore
      }
      if (exists) {
        toast.info("Removed from saved equipment");
      } else {
        toast.success("Saved to favorites");
      }
      return next;
    });
  };

  const isFavorite = (equipmentId: string) => favorites.includes(equipmentId);

  const addEquipment = (
    data: Omit<Equipment, "id" | "createdAt" | "rating" | "reviewCount">
  ) => {
    const newEquipment: Equipment = {
      ...data,
      id: `eq-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setEquipmentList((prev) => [newEquipment, ...prev]);
    toast.success("Equipment listing submitted for review!");
  };

  const updateEquipmentStatus = (id: string, status: Equipment["status"]) => {
    setEquipmentList((prev) =>
      prev.map((eq) => (eq.id === id ? { ...eq, status } : eq))
    );
    toast.success(`Equipment listing marked as ${status}`);
  };

  const deleteEquipment = (id: string) => {
    setEquipmentList((prev) => prev.filter((eq) => eq.id !== id));
    toast.success("Equipment listing deleted successfully");
  };

  const addBooking = (bookingData: Omit<RentalBooking, "id" | "createdAt">) => {
    const newBooking: RentalBooking = {
      ...bookingData,
      id: `bk-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setBookings((prev) => [newBooking, ...prev]);
    toast.success("Booking placed successfully! Owner notified.");
  };

  const updateBookingStatus = (
    id: string,
    status: RentalBooking["bookingStatus"]
  ) => {
    setBookings((prev) =>
      prev.map((bk) => (bk.id === id ? { ...bk, bookingStatus: status } : bk))
    );
    toast.success(`Booking status updated to ${status}`);
  };

  const updatePaymentStatus = (
    id: string,
    status: RentalBooking["paymentStatus"]
  ) => {
    setBookings((prev) =>
      prev.map((bk) => (bk.id === id ? { ...bk, paymentStatus: status } : bk))
    );
    toast.success(`Payment status updated to ${status}`);
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    toast.success(`User role updated to ${newRole}`);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentRole,
        favorites,
        toggleFavorite,
        isFavorite,
        equipmentList,
        addEquipment,
        updateEquipmentStatus,
        deleteEquipment,
        bookings,
        addBooking,
        updateBookingStatus,
        updatePaymentStatus,
        users,
        updateUserRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
