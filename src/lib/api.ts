import axios, { AxiosError } from "axios";
import { Equipment, RentalBooking, User, UserRole } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// In-memory non-persistent token holder (cleared upon page reload / tab close)
// Persistent authentication is handled exclusively via HTTP-only, Secure cookies
let inMemoryAccessToken: string | null = null;

export const setAccessToken = (token: string | null): void => {
  inMemoryAccessToken = token;
};

export const getAccessToken = (): string | null => inMemoryAccessToken;

// Attach in-memory access token if present during active session
api.interceptors.request.use((config) => {
  if (inMemoryAccessToken && config.headers) {
    config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
  }
  return config;
});

// Response unwrap & error handler
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: any }>) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected server error occurred";
    return Promise.reject(new Error(message));
  }
);

// ============================================================================
// DATA NORMALIZATION HELPERS
// ============================================================================

export function normalizeEquipment(item: any): Equipment {
  if (!item) return {} as Equipment;

  const images =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : item.imageUrl
      ? [item.imageUrl]
      : [
          "https://images.unsplash.com/photo-1768085091650-e8e89ef57b76?auto=format&fit=crop&w=1200&q=80",
        ];

  const ownerObj =
    typeof item.owner === "object" && item.owner !== null ? item.owner : {};
  const ownerName =
    item.ownerName || ownerObj.name || "Verified Heavy Fleet Owner";
  const ownerAvatar =
    item.ownerAvatar ||
    ownerObj.avatarUrl ||
    ownerObj.image ||
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80";

  const rawStatus = (item.status || "active").toString().toLowerCase();
  let normalizedStatus: Equipment["status"] = "active";
  if (rawStatus === "pending") normalizedStatus = "pending";
  else if (rawStatus === "rejected") normalizedStatus = "rejected";
  else if (rawStatus === "maintenance") normalizedStatus = "maintenance";

  return {
    id: item._id?.toString() || item.id || String(item._id),
    title: item.title || item.name || "Heavy Machinery Asset",
    slug:
      item.slug ||
      (item.title || item.name || "machinery")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-"),
    description: item.description || "Commercial machinery listing.",
    category: item.category || "Construction Equipment",
    rentalPrice: Number(item.rentalPrice) || 0,
    rentalType: (item.rentalType || "daily").toLowerCase() as any,
    availableQuantity: Number(item.availableQuantity ?? item.totalQuantity ?? 1),
    totalQuantity: Number(item.totalQuantity ?? item.availableQuantity ?? 1),
    condition: item.condition || "Excellent",
    brand: item.brand || "Industrial",
    model: item.model || "Heavy Series",
    location: item.location || "Regional Equipment Depot",
    images,
    featured: Boolean(item.featured),
    rating: Number(item.rating) || 5.0,
    reviewCount: Number(item.reviewCount) || 0,
    ownerId:
      ownerObj._id?.toString() ||
      ownerObj.id ||
      (typeof item.owner === "string" ? item.owner : "owner-1"),
    ownerName,
    ownerAvatar,
    ownerVerified: true,
    ownerPhone: ownerObj.phone,
    ownerEmail: ownerObj.email,
    terms: Array.isArray(item.rentalTerms)
      ? item.rentalTerms
      : Array.isArray(item.terms)
      ? item.terms
      : [item.rentalTerms || "Standard jobsite lease terms apply."],
    specifications: Array.isArray(item.specifications)
      ? item.specifications
      : [],
    status: normalizedStatus,
    createdAt: item.createdAt
      ? new Date(item.createdAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  };
}

export function normalizeBooking(item: any): RentalBooking {
  if (!item) return {} as RentalBooking;

  const eq =
    typeof item.equipment === "object" && item.equipment !== null
      ? item.equipment
      : {};
  const cust =
    typeof item.customer === "object" && item.customer !== null
      ? item.customer
      : {};
  const own =
    typeof item.owner === "object" && item.owner !== null ? item.owner : {};

  const images = Array.isArray(eq.images) && eq.images.length > 0 ? eq.images : eq.imageUrl ? [eq.imageUrl] : [];

  return {
    id: item._id?.toString() || item.id,
    equipmentId:
      eq._id?.toString() ||
      eq.id ||
      (typeof item.equipment === "string" ? item.equipment : ""),
    equipmentTitle:
      eq.title || eq.name || item.equipmentTitle || "Industrial Machinery",
    equipmentImage:
      images[0] ||
      item.equipmentImage ||
      "https://images.unsplash.com/photo-1768085091650-e8e89ef57b76?auto=format&fit=crop&w=600&q=80",
    equipmentCategory:
      eq.category || item.equipmentCategory || "Construction Equipment",
    customerId:
      cust._id?.toString() ||
      cust.id ||
      (typeof item.customer === "string" ? item.customer : ""),
    customerName: cust.name || item.customerName || "Contractor Customer",
    customerEmail: cust.email || item.customerEmail || "",
    customerPhone: item.contactNumber || cust.phone || item.customerPhone,
    ownerId:
      own._id?.toString() ||
      own.id ||
      (typeof item.owner === "string" ? item.owner : ""),
    ownerName: own.name || item.ownerName || "Fleet Owner",
    startDate: item.startDate
      ? new Date(item.startDate).toISOString().split("T")[0]
      : "",
    endDate: item.endDate
      ? new Date(item.endDate).toISOString().split("T")[0]
      : "",
    durationText: item.duration
      ? `${item.duration} ${item.rentalType || "Day"}(s)`
      : item.durationText || "1 Day",
    quantity: item.quantity || 1,
    unitPrice: item.unitPrice || 0,
    rentalType: (item.rentalType || "daily").toLowerCase() as any,
    totalAmount: item.totalAmount || 0,
    paymentStatus: (item.paymentStatus || "pending").toLowerCase() as any,
    bookingStatus: (item.bookingStatus || "pending").toLowerCase() as any,
    deliveryAddress: item.deliveryAddress,
    notes: item.additionalNotes || item.notes,
    createdAt: item.createdAt
      ? new Date(item.createdAt).toISOString().split("T")[0]
      : "",
  };
}

export function normalizeUser(item: any): User {
  if (!item) return {} as User;
  return {
    id: item._id?.toString() || item.id,
    name: item.name || "Contractor User",
    email: item.email || "",
    role: (item.role || "customer").toLowerCase() as UserRole,
    avatarUrl:
      item.avatarUrl ||
      item.image ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    phone: item.phone,
    address: item.address,
    joinedDate: item.createdAt
      ? new Date(item.createdAt).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        })
      : "Recent",
    totalRentals: item.totalRentals || 0,
  };
}

// ============================================================================
// API METHODS
// ============================================================================

export const authApi = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    role?: string;
    phone?: string;
    address?: string;
    avatarUrl?: string;
  }) {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  async login(data: { email: string; password: string }) {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  async googleAuth(data: {
    email: string;
    name: string;
    googleId?: string;
    avatarUrl?: string;
  }) {
    const res = await api.post("/auth/google", data);
    return res.data;
  },

  async getMe() {
    const res = await api.get("/auth/me");
    return res.data;
  },

  async logout() {
    const res = await api.post("/auth/logout");
    return res.data;
  },
};

export const equipmentApi = {
  async getEquipment(params?: {
    search?: string;
    category?: string;
    location?: string;
    rentalType?: string;
    minPrice?: number;
    maxPrice?: number;
    available?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
  }) {
    const res = await api.get("/equipment", { params });
    const rawList = res.data?.data || [];
    return {
      equipment: rawList.map(normalizeEquipment),
      meta: res.data?.meta || { total: rawList.length, page: 1, limit: 12, totalPages: 1 },
    };
  },

  async getFeatured() {
    const res = await api.get("/equipment/featured");
    const rawList = res.data?.data || [];
    return rawList.map(normalizeEquipment);
  },

  async getCategories() {
    const res = await api.get("/equipment/categories");
    return res.data?.data || [];
  },

  async getById(id: string) {
    const res = await api.get(`/equipment/${id}`);
    return normalizeEquipment(res.data?.data);
  },

  async checkAvailability(id: string, params: { startDate: string; endDate: string; quantity?: number }) {
    const res = await api.get(`/equipment/${id}/availability`, { params });
    return res.data?.data;
  },
};

export const uploadApi = {
  async uploadImage(fileOrBase64: File | string, name?: string) {
    if (typeof fileOrBase64 === "string") {
      const res = await api.post("/uploads/image", { image: fileOrBase64, name });
      return res.data?.data?.url || res.data?.data?.displayUrl;
    }
    const formData = new FormData();
    formData.append("image", fileOrBase64);
    if (name) formData.append("name", name);
    const res = await api.post("/uploads/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.data?.url || res.data?.data?.displayUrl;
  },
};

export const ownerApi = {
  async getEquipment(params?: any) {
    const res = await api.get("/owner/equipment", { params });
    const rawList = res.data?.data || [];
    return {
      equipment: rawList.map(normalizeEquipment),
      meta: res.data?.meta || { total: rawList.length, page: 1, limit: 20, totalPages: 1 },
    };
  },

  async createEquipment(data: any) {
    const res = await api.post("/owner/equipment", data);
    return normalizeEquipment(res.data?.data);
  },

  async updateEquipment(id: string, data: any) {
    const res = await api.put(`/owner/equipment/${id}`, data);
    return normalizeEquipment(res.data?.data);
  },

  async deleteEquipment(id: string) {
    const res = await api.delete(`/owner/equipment/${id}`);
    return res.data;
  },

  async getBookings(params?: any) {
    const res = await api.get("/owner/bookings", { params });
    const rawList = res.data?.data || [];
    return {
      bookings: rawList.map(normalizeBooking),
      meta: res.data?.meta || { total: rawList.length, page: 1, limit: 20, totalPages: 1 },
    };
  },

  async getAnalyticsOverview() {
    const res = await api.get("/owner/analytics/overview");
    return res.data?.data;
  },

  async getMonthlyEarnings(months = 6) {
    const res = await api.get("/owner/analytics/monthly-earnings", { params: { months } });
    return res.data?.data || [];
  },
};

export const bookingApi = {
  async createBooking(data: {
    equipmentId: string;
    startDate: string;
    endDate: string;
    quantity: number;
    contactNumber: string;
    deliveryAddress: string;
    additionalNotes?: string;
  }) {
    const res = await api.post("/bookings", data);
    return res.data?.data;
  },

  async getMyRentals(params?: any) {
    const res = await api.get("/bookings/my-rentals", { params });
    const rawList = res.data?.data || [];
    return {
      bookings: rawList.map(normalizeBooking),
      meta: res.data?.meta || { total: rawList.length, page: 1, limit: 20, totalPages: 1 },
    };
  },

  async getById(id: string) {
    const res = await api.get(`/bookings/${id}`);
    return normalizeBooking(res.data?.data);
  },

  async checkout(id: string) {
    const res = await api.post(`/bookings/${id}/checkout`);
    return res.data?.data;
  },
};

export const favoriteApi = {
  async getFavorites(params?: any) {
    const res = await api.get("/favorites", { params });
    const rawList = res.data?.data || [];
    const favorites = rawList
      .map((fav: any) => ({
        ...fav,
        equipment: fav.equipment ? normalizeEquipment(fav.equipment) : null,
      }))
      .filter((fav: any) => fav.equipment !== null);
    return {
      favorites,
      meta: res.data?.meta || { total: favorites.length, page: 1, limit: 20, totalPages: 1 },
    };
  },

  async addFavorite(equipmentId: string) {
    const res = await api.post(`/favorites/${equipmentId}`);
    return res.data?.data;
  },

  async removeFavorite(equipmentId: string) {
    const res = await api.delete(`/favorites/${equipmentId}`);
    return res.data?.data;
  },

  async checkStatus(equipmentId: string) {
    const res = await api.get(`/favorites/${equipmentId}/status`);
    return res.data?.data?.isFavorite || false;
  },
};

export const adminApi = {
  async getEquipment(params?: any) {
    const res = await api.get("/admin/equipment", { params });
    const rawList = res.data?.data || [];
    return {
      equipment: rawList.map(normalizeEquipment),
      meta: res.data?.meta || { total: rawList.length, page: 1, limit: 20, totalPages: 1 },
    };
  },

  async approveEquipment(id: string) {
    const res = await api.patch(`/admin/equipment/${id}/approve`);
    return normalizeEquipment(res.data?.data);
  },

  async rejectEquipment(id: string, rejectionReason: string) {
    const res = await api.patch(`/admin/equipment/${id}/reject`, { rejectionReason });
    return normalizeEquipment(res.data?.data);
  },

  async deleteEquipment(id: string) {
    const res = await api.delete(`/admin/equipment/${id}`);
    return res.data;
  },

  async getBookings(params?: any) {
    const res = await api.get("/admin/bookings", { params });
    const rawList = res.data?.data || [];
    return {
      bookings: rawList.map(normalizeBooking),
      meta: res.data?.meta || { total: rawList.length, page: 1, limit: 20, totalPages: 1 },
    };
  },

  async updateBookingStatus(
    id: string,
    data: { bookingStatus?: string; paymentStatus?: string }
  ) {
    const res = await api.patch(`/admin/bookings/${id}/status`, data);
    return normalizeBooking(res.data?.data);
  },

  async getAnalyticsOverview() {
    const res = await api.get("/admin/analytics/overview");
    return res.data?.data;
  },

  async getMonthlyBookings(months = 6) {
    const res = await api.get("/admin/analytics/monthly-bookings", { params: { months } });
    return res.data?.data || [];
  },

  async getUsers(params?: any) {
    const res = await api.get("/admin/users", { params });
    const rawList = res.data?.data || [];
    return {
      users: rawList.map(normalizeUser),
      meta: res.data?.meta || { total: rawList.length, page: 1, limit: 20, totalPages: 1 },
    };
  },

  async updateUserRole(id: string, role: UserRole) {
    const res = await api.patch(`/admin/users/${id}/role`, { role });
    return normalizeUser(res.data?.data);
  },
};
