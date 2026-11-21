"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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
import {
  authApi,
  equipmentApi,
  favoriteApi,
  bookingApi,
  adminApi,
  ownerApi,
  normalizeUser,
  normalizeBooking,
  setAccessToken,
} from "@/lib/api";
import { toast } from "sonner";

interface AppContextType {
  currentUser: User | null;
  currentRole: UserRole | "guest";
  setCurrentRole: (role: UserRole | "guest") => void;
  registerUser: (userData: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    avatarUrl?: string;
    phone?: string;
    address?: string;
  }) => Promise<User>;
  loginUser: (email: string, password?: string, role?: UserRole) => Promise<User | null>;
  loginWithGoogle: (googleData: {
    email: string;
    name: string;
    avatarUrl?: string;
    googleId?: string;
  }) => Promise<User | null>;
  logout: () => Promise<void>;
  favorites: string[];
  toggleFavorite: (equipmentId: string) => Promise<void>;
  isFavorite: (equipmentId: string) => boolean;
  equipmentList: Equipment[];
  refreshEquipment: () => Promise<void>;
  addEquipment: (equipment: Omit<Equipment, "id" | "createdAt" | "rating" | "reviewCount">) => Promise<void>;
  updateEquipmentStatus: (id: string, status: Equipment["status"], reason?: string) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
  bookings: RentalBooking[];
  refreshBookings: () => Promise<void>;
  addBooking: (booking: Omit<RentalBooking, "id" | "createdAt">) => Promise<string | undefined>;
  updateBookingStatus: (id: string, status: RentalBooking["bookingStatus"]) => Promise<void>;
  updatePaymentStatus: (id: string, status: RentalBooking["paymentStatus"]) => Promise<void>;
  users: User[];
  refreshUsers: () => Promise<void>;
  updateUserRole: (userId: string, newRole: UserRole) => Promise<void>;
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
    return [];
  });

  const [equipmentList, setEquipmentList] = useState<Equipment[]>(MOCK_EQUIPMENT);
  const [bookings, setBookings] = useState<RentalBooking[]>(MOCK_BOOKINGS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  // --------------------------------------------------------------------------
  // HYDRATE FROM BACKEND ON MOUNT
  // --------------------------------------------------------------------------
  const refreshEquipment = useCallback(async () => {
    try {
      const res = await equipmentApi.getEquipment({ limit: 50 });
      if (res.equipment && res.equipment.length > 0) {
        setEquipmentList(res.equipment);
      }
    } catch {
      // Backend not running or empty; fallback to mock items
    }
  }, []);

  const refreshFavorites = useCallback(async () => {
    try {
      const res = await favoriteApi.getFavorites();
      if (res.favorites) {
        const ids = res.favorites.map((f: any) => f.equipment?.id || f.equipmentId || f._id);
        setFavorites(ids.filter(Boolean));
        if (typeof window !== "undefined") {
          localStorage.setItem("rentora_favorites", JSON.stringify(ids));
        }
      }
    } catch {
      // Not logged in or error; keep local favorites
    }
  }, []);

  const refreshBookings = useCallback(async () => {
    try {
      if (currentRole === "customer") {
        const res = await bookingApi.getMyRentals();
        if (res.bookings) setBookings(res.bookings);
      } else if (currentRole === "owner") {
        const res = await ownerApi.getBookings();
        if (res.bookings) setBookings(res.bookings);
      } else if (currentRole === "admin") {
        const res = await adminApi.getBookings();
        if (res.bookings) setBookings(res.bookings);
      }
    } catch {
      // Ignore
    }
  }, [currentRole]);

  const refreshUsers = useCallback(async () => {
    try {
      if (currentRole === "admin") {
        const res = await adminApi.getUsers();
        if (res.users && res.users.length > 0) {
          setUsers(res.users);
        }
      }
    } catch {
      // Ignore
    }
  }, [currentRole]);

  useEffect(() => {
    // 1. Initial equipment load
    refreshEquipment();

    // 2. Validate current session with backend
    const hydrateSession = async () => {
      try {
        const res = await authApi.getMe();
        if (res.data?.user) {
          const user = normalizeUser(res.data.user);
          setRegisteredUser(user);
          setRoleState(user.role);
          if (typeof window !== "undefined") {
            localStorage.setItem("rentora_active_user", JSON.stringify(user));
            localStorage.setItem("rentora_role", user.role);
          }
          refreshFavorites();
        }
      } catch {
        // Token expired or unauthenticated: ensure guest state
        if (process.env.NODE_ENV === "production") {
          setRegisteredUser(null);
          setRoleState("guest");
          if (typeof window !== "undefined") {
            localStorage.removeItem("rentora_active_user");
            localStorage.setItem("rentora_role", "guest");
          }
        }
      }
    };

    hydrateSession();
  }, [refreshEquipment, refreshFavorites]);

  useEffect(() => {
    if (registeredUser) {
      refreshBookings();
      if (currentRole === "admin") refreshUsers();
      if (currentRole === "customer") refreshFavorites();
    }
  }, [currentRole, registeredUser, refreshBookings, refreshUsers, refreshFavorites]);

  // --------------------------------------------------------------------------
  // ROLE & AUTH METHODS
  // --------------------------------------------------------------------------
  const setCurrentRole = (role: UserRole | "guest") => {
    // In production, persona switching is disabled: backend JWT is the sole authority for role
    if (process.env.NODE_ENV === "production") {
      if (role === "guest") {
        logout();
        return;
      }
      if (registeredUser) {
        if (registeredUser.role !== role) {
          toast.error("Role switching is disabled in production. Please log in with an account that possesses this role.");
          return;
        }
      } else {
        toast.error("Please sign in to access this role.");
        return;
      }
    }

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

  const registerUser = async (userData: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    avatarUrl?: string;
    phone?: string;
    address?: string;
  }): Promise<User> => {
    let createdUser: User;
    const defaultPassword = userData.password || "Password@1234";

    try {
      const res = await authApi.register({
        name: userData.name,
        email: userData.email,
        password: defaultPassword,
        confirmPassword: defaultPassword,
        role: userData.role,
        avatarUrl: userData.avatarUrl,
        phone: userData.phone,
        address: userData.address,
      });

      if (res.data?.token) {
        setAccessToken(res.data.token);
      }
      createdUser = normalizeUser(res.data?.user);
    } catch (err: any) {
      // If server is unreachable, create offline user gracefully
      createdUser = {
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
      toast.warning(err.message || "Offline registration saved locally");
    }

    setUsers((prev) => [createdUser, ...prev.filter((u) => u.email !== createdUser.email)]);
    setRegisteredUser(createdUser);
    setRoleState(createdUser.role);

    try {
      localStorage.setItem("rentora_active_user", JSON.stringify(createdUser));
      localStorage.setItem("rentora_role", createdUser.role);
    } catch {
      // Ignore
    }

    return createdUser;
  };

  const loginUser = async (email: string, password?: string, role?: UserRole): Promise<User | null> => {
    let userToUse: User | null = null;
    const pass = password || "Password@1234";

    try {
      const res = await authApi.login({ email, password: pass });
      if (res.data?.token) {
        setAccessToken(res.data.token);
      }
      userToUse = normalizeUser(res.data?.user);
    } catch {
      // Fallback to local user detection
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      const targetRole = role || found?.role || "customer";
      userToUse =
        found ||
        (registeredUser && registeredUser.email.toLowerCase() === email.toLowerCase()
          ? registeredUser
          : users.find((u) => u.role === targetRole) || users[0]);
    }

    if (userToUse) {
      setRegisteredUser(userToUse);
      setRoleState(userToUse.role);

      try {
        localStorage.setItem("rentora_active_user", JSON.stringify(userToUse));
        localStorage.setItem("rentora_role", userToUse.role);
      } catch {
        // Ignore
      }
      refreshFavorites();
      refreshBookings();
    }

    return userToUse;
  };

  const loginWithGoogle = async (googleData: {
    email: string;
    name: string;
    avatarUrl?: string;
    googleId?: string;
  }): Promise<User | null> => {
    try {
      const res = await authApi.googleAuth(googleData);
      if (res.data?.token) {
        setAccessToken(res.data.token);
      }
      const userToUse = normalizeUser(res.data?.user);
      setRegisteredUser(userToUse);
      setRoleState(userToUse.role);
      try {
        localStorage.setItem("rentora_active_user", JSON.stringify(userToUse));
        localStorage.setItem("rentora_role", userToUse.role);
      } catch {
        // Ignore
      }
      refreshFavorites();
      refreshBookings();
      return userToUse;
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || err?.message || "Google authentication failed");
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore
    }
    setAccessToken(null);
    setRegisteredUser(null);
    setRoleState("guest");
    setFavorites([]);
    try {
      localStorage.removeItem("rentora_active_user");
      localStorage.setItem("rentora_role", "guest");
      localStorage.removeItem("rentora_favorites");
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

  // --------------------------------------------------------------------------
  // FAVORITES
  // --------------------------------------------------------------------------
  const isFavorite = (equipmentId: string) => favorites.includes(equipmentId);

  const toggleFavorite = async (equipmentId: string) => {
    const exists = favorites.includes(equipmentId);
    const next = exists ? favorites.filter((id) => id !== equipmentId) : [...favorites, equipmentId];
    setFavorites(next);
    try {
      localStorage.setItem("rentora_favorites", JSON.stringify(next));
    } catch {
      // Ignore
    }

    try {
      if (exists) {
        await favoriteApi.removeFavorite(equipmentId);
        toast.info("Removed from saved equipment");
      } else {
        await favoriteApi.addFavorite(equipmentId);
        toast.success("Saved to favorites");
      }
    } catch {
      toast.info(exists ? "Removed from favorites (local)" : "Saved to favorites (local)");
    }
  };

  // --------------------------------------------------------------------------
  // EQUIPMENT MANAGEMENT
  // --------------------------------------------------------------------------
  const addEquipment = async (
    data: Omit<Equipment, "id" | "createdAt" | "rating" | "reviewCount">
  ) => {
    try {
      const created = await ownerApi.createEquipment({
        name: data.title,
        title: data.title,
        description: data.description,
        category: data.category,
        rentalPrice: data.rentalPrice,
        rentalType: data.rentalType === "monthly" ? "Monthly" : data.rentalType === "weekly" ? "Weekly" : "Daily",
        availableQuantity: data.availableQuantity,
        totalQuantity: data.totalQuantity,
        condition: data.condition,
        brand: data.brand,
        model: data.model,
        location: data.location,
        imageUrl: data.images[0],
        images: data.images,
        rentalTerms: data.terms,
      });
      setEquipmentList((prev) => [created, ...prev]);
      toast.success("Equipment listing submitted for admin review!");
    } catch {
      const localEquipment: Equipment = {
        ...data,
        id: `eq-${Date.now()}`,
        rating: 5.0,
        reviewCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
        status: "pending",
      };
      setEquipmentList((prev) => [localEquipment, ...prev]);
      toast.success("Equipment listing submitted for review!");
    }
  };

  const updateEquipmentStatus = async (
    id: string,
    status: Equipment["status"],
    reason = "Standard administrative review"
  ) => {
    try {
      if (status === "active") {
        await adminApi.approveEquipment(id);
      } else if (status === "rejected") {
        await adminApi.rejectEquipment(id, reason);
      }
    } catch {
      // Local fallback
    }
    setEquipmentList((prev) =>
      prev.map((eq) => (eq.id === id ? { ...eq, status } : eq))
    );
    toast.success(`Equipment listing marked as ${status}`);
  };

  const deleteEquipment = async (id: string) => {
    try {
      if (currentRole === "admin") {
        await adminApi.deleteEquipment(id);
      } else {
        await ownerApi.deleteEquipment(id);
      }
    } catch {
      // Local fallback
    }
    setEquipmentList((prev) => prev.filter((eq) => eq.id !== id));
    toast.success("Equipment listing deleted successfully");
  };

  // --------------------------------------------------------------------------
  // BOOKING & PAYMENTS
  // --------------------------------------------------------------------------
  const addBooking = async (
    bookingData: Omit<RentalBooking, "id" | "createdAt">
  ): Promise<string | undefined> => {
    let checkoutUrl: string | undefined;

    try {
      const result = await bookingApi.createBooking({
        equipmentId: bookingData.equipmentId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        quantity: bookingData.quantity,
        contactNumber: bookingData.customerPhone || "+1 (555) 345-6789",
        deliveryAddress: bookingData.deliveryAddress || "Regional Site Depot",
        additionalNotes: bookingData.notes,
      });

      if (result?.checkoutUrl) {
        checkoutUrl = result.checkoutUrl;
      }
      if (result?.booking) {
        setBookings((prev) => [normalizeBooking(result.booking), ...prev]);
      }
      toast.success("Booking initialized! Redirecting to secure Stripe Checkout...");
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to initialize Stripe payment. Please check your reservation details.";
      toast.error(errMsg);
      throw new Error(errMsg);
    }

    return checkoutUrl;
  };

  const updateBookingStatus = async (
    id: string,
    status: RentalBooking["bookingStatus"]
  ) => {
    try {
      await adminApi.updateBookingStatus(id, {
        bookingStatus:
          status === "confirmed"
            ? "Confirmed"
            : status === "completed"
            ? "Completed"
            : status === "cancelled"
            ? "Cancelled"
            : "Active",
      });
    } catch {
      // Local fallback
    }
    setBookings((prev) =>
      prev.map((bk) => (bk.id === id ? { ...bk, bookingStatus: status } : bk))
    );
    toast.success(`Booking status updated to ${status}`);
  };

  const updatePaymentStatus = async (
    id: string,
    status: RentalBooking["paymentStatus"]
  ) => {
    try {
      await adminApi.updateBookingStatus(id, {
        paymentStatus: status === "paid" ? "Paid" : status === "refunded" ? "Refunded" : "Pending",
      });
    } catch {
      // Local fallback
    }
    setBookings((prev) =>
      prev.map((bk) => (bk.id === id ? { ...bk, paymentStatus: status } : bk))
    );
    toast.success(`Payment status updated to ${status}`);
  };

  // --------------------------------------------------------------------------
  // USER ROLE MANAGEMENT
  // --------------------------------------------------------------------------
  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const updated = await adminApi.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: updated.role } : u))
      );
      toast.success(`User role updated to ${newRole}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update user role");
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentRole,
        registerUser,
        loginUser,
        loginWithGoogle,
        logout,
        favorites,
        toggleFavorite,
        isFavorite,
        equipmentList,
        refreshEquipment,
        addEquipment,
        updateEquipmentStatus,
        deleteEquipment,
        bookings,
        refreshBookings,
        addBooking,
        updateBookingStatus,
        updatePaymentStatus,
        users,
        refreshUsers,
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
