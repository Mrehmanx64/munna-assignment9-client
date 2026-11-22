"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  Equipment,
  RentalBooking,
  User,
  UserRole,
} from "@/types";
import {
  authApi,
  equipmentApi,
  favoriteApi,
  bookingApi,
  adminApi,
  ownerApi,
  userApi,
  normalizeUser,
  normalizeBooking,
  setAccessToken,
  getAccessToken,
} from "@/lib/api";
import { toast } from "sonner";

interface AppContextType {
  currentUser: User | null;
  currentRole: UserRole | "guest";
  isAuthResolving: boolean;
  setCurrentRole: (role: UserRole | "guest") => void;
  registerUser: (userData: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    avatarUrl?: string;
    phone?: string;
    address?: string;
  }) => Promise<User>;
  loginUser: (email: string, password?: string) => Promise<User | null>;
  loginWithGoogle: (idToken: string) => Promise<User | null>;
  logout: () => Promise<void>;
  updateProfile: (data: {
    name?: string;
    phone?: string;
    address?: string;
    avatarUrl?: string;
  }) => Promise<User>;
  favorites: string[];
  toggleFavorite: (equipmentId: string) => Promise<void>;
  isFavorite: (equipmentId: string) => boolean;
  equipmentList: Equipment[];
  refreshEquipment: () => Promise<void>;
  addEquipment: (equipment: Omit<Equipment, "id" | "createdAt" | "rating" | "reviewCount">) => Promise<void>;
  updateEquipment: (id: string, data: Partial<Equipment>) => Promise<Equipment>;
  updateEquipmentStatus: (id: string, status: Equipment["status"], reason?: string) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
  bookings: RentalBooking[];
  refreshBookings: () => Promise<void>;
  addBooking: (booking: Omit<RentalBooking, "id" | "createdAt">) => Promise<string | undefined>;
  updateBookingStatus: (id: string, status: RentalBooking["bookingStatus"]) => Promise<void>;
  users: User[];
  refreshUsers: () => Promise<void>;
  updateUserRole: (userId: string, newRole: UserRole) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setRoleState] = useState<UserRole | "guest">("guest");
  const [registeredUser, setRegisteredUser] = useState<User | null>(null);
  const [isAuthResolving, setIsAuthResolving] = useState<boolean>(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [bookings, setBookings] = useState<RentalBooking[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // --------------------------------------------------------------------------
  // HYDRATE FROM BACKEND ON MOUNT
  // --------------------------------------------------------------------------
  const refreshEquipment = useCallback(async () => {
    try {
      const res = await equipmentApi.getEquipment({ limit: 50 });
      if (res.equipment) {
        setEquipmentList(res.equipment);
      }
    } catch {
      // Backend error
    }
  }, []);

  const refreshFavorites = useCallback(async () => {
    try {
      const res = await favoriteApi.getFavorites();
      if (res.favorites) {
        const ids = res.favorites.map((f: any) => f.equipment?.id || f.equipmentId || f._id);
        setFavorites(ids.filter(Boolean));
      }
    } catch {
      // Not logged in or unauthenticated
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
        if (res.users) {
          setUsers(res.users);
        }
      }
    } catch {
      // Ignore
    }
  }, [currentRole]);

  const hydrateSession = useCallback(async () => {
    // If no access token exists in storage, user is guest — do not query or resurrect
    const token = getAccessToken();
    if (!token) {
      setRegisteredUser(null);
      setRoleState("guest");
      setIsAuthResolving(false);
      return;
    }

    try {
      const res = await authApi.getMe();
      const rawUser = res.data?.user || res.data?.data?.user || res.data?.data || res.data;
      const newToken = res.data?.token || res.data?.data?.token;
      if (newToken) {
        setAccessToken(newToken);
      }
      if (rawUser && (rawUser.id || rawUser._id || rawUser.email)) {
        const user = normalizeUser(rawUser);
        setRegisteredUser(user);
        setRoleState(user.role);
        refreshFavorites();
      } else {
        setRegisteredUser(null);
        setRoleState("guest");
        setAccessToken(null);
      }
    } catch {
      // Expired or unauthenticated: set strictly to guest
      setRegisteredUser(null);
      setRoleState("guest");
      setAccessToken(null);
    } finally {
      setIsAuthResolving(false);
    }
  }, [refreshFavorites]);

  useEffect(() => {
    // 1. Initial equipment load
    refreshEquipment();

    // 2. Validate current session with backend using shared token
    hydrateSession();

    // 3. Multi-tab synchronization listener: instantly sync logouts and account switches across all tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "rentora_auth_token") {
        if (!e.newValue) {
          // Logged out in another tab
          setRegisteredUser(null);
          setRoleState("guest");
          setFavorites([]);
          setBookings([]);
          toast.info("Signed out from another browser tab");
        } else if (e.newValue !== e.oldValue) {
          // Switched accounts or logged in in another tab
          hydrateSession();
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const currentToken = getAccessToken();
        if (!currentToken) {
          setRegisteredUser(null);
          setRoleState("guest");
          setFavorites([]);
          setBookings([]);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refreshEquipment, hydrateSession]);

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
    if (role === "guest") {
      logout();
      return;
    }
    if (registeredUser) {
      if (registeredUser.role !== role) {
        toast.error("Role switching is disabled. Your verified account role is " + registeredUser.role);
        return;
      }
      setRoleState(role);
    } else {
      toast.error("Please sign in to access your dashboard.");
    }
  };

  const registerUser = async (userData: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    avatarUrl?: string;
    phone?: string;
    address?: string;
  }): Promise<User> => {
    if (!userData.password) {
      throw new Error("Password is required for registration.");
    }

    try {
      const res = await authApi.register({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.password,
        role: userData.role === "owner" ? "owner" : "customer",
        avatarUrl: userData.avatarUrl,
        phone: userData.phone,
        address: userData.address,
      });

      const rawUser = res.data?.user || res.data?.data?.user || res.data?.data;
      const token = res.data?.token || res.data?.data?.token;
      if (token) {
        setAccessToken(token);
      }
      if (!rawUser) {
        throw new Error("Invalid registration response from server");
      }

      const createdUser = normalizeUser(rawUser);
      setRegisteredUser(createdUser);
      setRoleState(createdUser.role);
      toast.success("Registration successful! Welcome to Rentora.");
      return createdUser;
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message || err?.message || "Registration failed. Please check your information.";
      toast.error(errMsg);
      throw new Error(errMsg);
    }
  };

  const loginUser = async (email: string, password?: string): Promise<User | null> => {
    if (!password) {
      const msg = "Please enter your password to sign in.";
      toast.error(msg);
      throw new Error(msg);
    }

    try {
      const res = await authApi.login({ email, password });
      const rawUser = res.data?.user || res.data?.data?.user || res.data?.data;
      const token = res.data?.token || res.data?.data?.token;
      if (token) {
        setAccessToken(token);
      }
      if (!rawUser) {
        throw new Error("Invalid authentication credentials");
      }

      const loggedInUser = normalizeUser(rawUser);
      setRegisteredUser(loggedInUser);
      setRoleState(loggedInUser.role);
      refreshFavorites();
      refreshBookings();
      return loggedInUser;
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || "Failed to sign in. Please check credentials.";
      toast.error(errMsg);
      throw new Error(errMsg);
    }
  };

  const loginWithGoogle = async (idToken: string): Promise<User | null> => {
    try {
      const res = await authApi.googleAuth({ idToken });
      const rawUser = res.data?.user || res.data?.data?.user || res.data?.data;
      const token = res.data?.token || res.data?.data?.token;
      if (token) {
        setAccessToken(token);
      }
      if (!rawUser) {
        throw new Error("Google authentication failed to retrieve user profile");
      }

      const userToUse = normalizeUser(rawUser);
      setRegisteredUser(userToUse);
      setRoleState(userToUse.role);
      refreshFavorites();
      refreshBookings();
      return userToUse;
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || "Google authentication failed";
      toast.error(errMsg);
      throw new Error(errMsg);
    }
  };

  const logout = async () => {
    // 1. Immediately wipe local auth token & user state to prevent session resurrection
    setAccessToken(null);
    setRegisteredUser(null);
    setRoleState("guest");
    setFavorites([]);
    setBookings([]);

    // 2. Clear backend cookies
    try {
      await authApi.logout();
    } catch {
      // Ignore network failure on logout
    }

    toast.info("Signed out to Guest mode");
  };

  const updateProfile = async (data: {
    name?: string;
    phone?: string;
    address?: string;
    avatarUrl?: string;
  }): Promise<User> => {
    try {
      const updatedUser = await userApi.updateProfile(data);
      setRegisteredUser(updatedUser);
      toast.success("Profile credentials updated successfully!");
      return updatedUser;
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || "Failed to update profile";
      toast.error(errMsg);
      throw new Error(errMsg);
    }
  };

  const currentUser = currentRole === "guest" ? null : registeredUser;

  // --------------------------------------------------------------------------
  // FAVORITES
  // --------------------------------------------------------------------------
  const isFavorite = (equipmentId: string) => favorites.includes(equipmentId);

  const toggleFavorite = async (equipmentId: string) => {
    if (!registeredUser || currentRole === "guest") {
      toast.info("Please sign in to save equipment to your favorites");
      return;
    }

    const exists = favorites.includes(equipmentId);

    try {
      if (exists) {
        await favoriteApi.removeFavorite(equipmentId);
        setFavorites((prev) => prev.filter((id) => id !== equipmentId));
        toast.info("Removed from saved equipment");
      } else {
        await favoriteApi.addFavorite(equipmentId);
        setFavorites((prev) => [...prev, equipmentId]);
        toast.success("Saved to favorites");
      }
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || "Failed to update favorite status";
      toast.error(errMsg);
    }
  };

  // --------------------------------------------------------------------------
  // EQUIPMENT MANAGEMENT
  // --------------------------------------------------------------------------
  const addEquipment = async (
    data: Omit<Equipment, "id" | "createdAt" | "rating" | "reviewCount">
  ) => {
    try {
      const termsStr = Array.isArray(data.terms)
        ? data.terms.filter(Boolean).join("\n")
        : typeof (data as any).rentalTerms === "string"
        ? (data as any).rentalTerms
        : typeof data.terms === "string"
        ? data.terms
        : "Standard commercial equipment rental terms and operating safety guidelines apply.";

      const firstImage =
        Array.isArray(data.images) && data.images.length > 0
          ? data.images[0]
          : (data as any).imageUrl ||
            "https://images.unsplash.com/photo-1768085091650-e8e89ef57b76?q=80&w=1171&auto=format&fit=crop";

      const allImages =
        Array.isArray(data.images) && data.images.length > 0
          ? data.images
          : [firstImage];

      const created = await ownerApi.createEquipment({
        name: data.title,
        title: data.title,
        description: data.description,
        category: data.category,
        rentalPrice: Number(data.rentalPrice),
        rentalType:
          data.rentalType === "monthly"
            ? "Monthly"
            : data.rentalType === "weekly"
            ? "Weekly"
            : "Daily",
        availableQuantity: Number(data.availableQuantity ?? 1),
        totalQuantity: Number(data.totalQuantity ?? 1),
        condition: data.condition,
        brand: data.brand,
        model: data.model,
        location: data.location,
        imageUrl: firstImage,
        images: allImages,
        rentalTerms: termsStr,
        terms: termsStr,
        specifications: Array.isArray(data.specifications) ? data.specifications : [],
      });
      setEquipmentList((prev) => [created, ...prev]);
      toast.success("Equipment listing submitted for admin review!");
    } catch (err: any) {
      const fieldErrors = err?.response?.data?.errors;
      let errMsg = err?.response?.data?.message || err?.message || "Failed to create equipment listing";
      if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
        const details = fieldErrors.map((f: any) => `${f.field}: ${f.message}`).join("; ");
        errMsg = `${errMsg} (${details})`;
      }
      toast.error(errMsg);
      throw new Error(errMsg);
    }
  };

  const updateEquipment = async (id: string, data: Partial<Equipment>): Promise<Equipment> => {
    try {
      const updated = await ownerApi.updateEquipment(id, data);
      setEquipmentList((prev) =>
        prev.map((eq) => (eq.id === id ? updated : eq))
      );
      toast.success("Equipment listing updated successfully");
      return updated;
    } catch (err: any) {
      const fieldErrors = err?.response?.data?.errors;
      let errMsg = err?.response?.data?.message || err?.message || "Failed to update equipment listing";
      if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
        const details = fieldErrors.map((f: any) => `${f.field}: ${f.message}`).join("; ");
        errMsg = `${errMsg} (${details})`;
      }
      toast.error(errMsg);
      throw new Error(errMsg);
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
      setEquipmentList((prev) =>
        prev.map((eq) => (eq.id === id ? { ...eq, status } : eq))
      );
      toast.success(`Equipment listing marked as ${status}`);
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || "Failed to update equipment status";
      toast.error(errMsg);
      throw new Error(errMsg);
    }
  };

  const deleteEquipment = async (id: string) => {
    try {
      if (currentRole === "admin") {
        await adminApi.deleteEquipment(id);
      } else {
        await ownerApi.deleteEquipment(id);
      }
      setEquipmentList((prev) => prev.filter((eq) => eq.id !== id));
      toast.success("Equipment listing deleted successfully");
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || "Failed to delete equipment listing";
      toast.error(errMsg);
      throw new Error(errMsg);
    }
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
    const backendStatus =
      status === "confirmed"
        ? "Confirmed"
        : status === "completed"
        ? "Completed"
        : status === "cancelled"
        ? "Cancelled"
        : "Active";

    try {
      if (currentRole === "owner") {
        await ownerApi.updateBookingStatus(id, backendStatus);
      } else {
        await adminApi.updateBookingStatus(id, { bookingStatus: backendStatus });
      }
      setBookings((prev) =>
        prev.map((bk) => (bk.id === id ? { ...bk, bookingStatus: status } : bk))
      );
      toast.success(`Booking status updated to ${status}`);
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || "Failed to update booking status";
      toast.error(errMsg);
      throw new Error(errMsg);
    }
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
      const errMsg = err?.response?.data?.message || err?.message || "Failed to update user role";
      toast.error(errMsg);
      throw new Error(errMsg);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthResolving,
        setCurrentRole,
        registerUser,
        loginUser,
        loginWithGoogle,
        logout,
        updateProfile,
        favorites,
        toggleFavorite,
        isFavorite,
        equipmentList,
        refreshEquipment,
        addEquipment,
        updateEquipment,
        updateEquipmentStatus,
        deleteEquipment,
        bookings,
        refreshBookings,
        addBooking,
        updateBookingStatus,
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
