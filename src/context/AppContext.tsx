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
  registerUser: (userData: {
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
    phone?: string;
    address?: string;
  }) => User;
  loginUser: (email: string, role?: UserRole) => User | null;
  logout: () => void;
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
    return "guest";
  });

  const [registeredUser, setRegisteredUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("rentora_active_user");
        if (saved) return JSON.parse(saved);
      } catch {
        // Ignore
      }
    }
    return null;
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
      const u =
        registeredUser && registeredUser.role === role
          ? registeredUser
          : users.find((usr) => usr.role === role);
      toast.success(`Switched active view to ${role.toUpperCase()}: ${u?.name || role}`);
    }
  };

  const registerUser = (userData: {
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
    phone?: string;
    address?: string;
  }): User => {
    const newUser: User = {
      id: `usr-${Date.now().toString().slice(-6)}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      avatarUrl:
        userData.avatarUrl ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      phone: userData.phone || "+1 (555) 234-5678",
      address: userData.address || "Industrial Way, Suite 400",
      joinedDate: "Today",
      totalRentals: 0,
    };

    setUsers((prev) => [newUser, ...prev.filter((u) => u.email !== newUser.email)]);
    setRegisteredUser(newUser);
    setRoleState(userData.role);

    try {
      localStorage.setItem("rentora_active_user", JSON.stringify(newUser));
      localStorage.setItem("rentora_role", userData.role);
    } catch {
      // Ignore
    }

    return newUser;
  };

  const loginUser = (email: string, role?: UserRole): User | null => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    const targetRole = role || found?.role || "customer";
    const userToUse =
      found ||
      (registeredUser && registeredUser.email.toLowerCase() === email.toLowerCase()
        ? registeredUser
        : users.find((u) => u.role === targetRole) || users[0]);

    setRegisteredUser(userToUse);
    setRoleState(targetRole);

    try {
      localStorage.setItem("rentora_active_user", JSON.stringify(userToUse));
      localStorage.setItem("rentora_role", targetRole);
    } catch {
      // Ignore
    }

    return userToUse;
  };

  const logout = () => {
    setRegisteredUser(null);
    setRoleState("guest");
    try {
      localStorage.removeItem("rentora_active_user");
      localStorage.setItem("rentora_role", "guest");
    } catch {
      // Ignore
    }
    toast.info("Signed out to Guest mode");
  };

  const currentUser =
    currentRole === "guest"
      ? null
      : registeredUser && registeredUser.role === currentRole
      ? registeredUser
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
        registerUser,
        loginUser,
        logout,
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
