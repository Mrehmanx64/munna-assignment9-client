export type UserRole = "customer" | "owner" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  phone?: string;
  address?: string;
  joinedDate: string;
  totalRentals?: number;
}

export type EquipmentCategory =
  | "Construction Equipment"
  | "Photography Equipment"
  | "Vehicles & Transportation"
  | "Agriculture Equipment"
  | "Electronics"
  | "Event Equipment";

export type RentalType = "daily" | "weekly" | "monthly" | "hourly";

export type EquipmentCondition = "Like New" | "Excellent" | "Good" | "Fair";

export type EquipmentStatus = "active" | "pending" | "rejected" | "maintenance";

export interface EquipmentSpecification {
  label: string;
  value: string;
}

export interface Equipment {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: EquipmentCategory;
  rentalPrice: number;
  rentalType: RentalType;
  availableQuantity: number;
  totalQuantity: number;
  condition: EquipmentCondition;
  brand: string;
  model: string;
  location: string;
  images: string[];
  featured?: boolean;
  rating: number;
  reviewCount: number;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerVerified: boolean;
  ownerPhone?: string;
  ownerEmail?: string;
  terms: string[];
  specifications: EquipmentSpecification[];
  status: EquipmentStatus;
  createdAt: string;
}

export type PaymentStatus = "paid" | "pending" | "refunded";
export type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";

export interface RentalBooking {
  id: string;
  equipmentId: string;
  equipmentTitle: string;
  equipmentImage: string;
  equipmentCategory: EquipmentCategory;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  ownerId: string;
  ownerName: string;
  startDate: string;
  endDate: string;
  durationText: string;
  quantity: number;
  unitPrice: number;
  rentalType: RentalType;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  deliveryAddress?: string;
  notes?: string;
  createdAt: string;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  customerAvatar: string;
  customerRole?: string;
  rating: number;
  date: string;
  comment: string;
  equipmentRented: string;
  verifiedRental: boolean;
}

export interface CategorySummary {
  name: EquipmentCategory;
  slug: string;
  count: number;
  description: string;
  image: string;
  startingPrice: number;
}

export interface FilterState {
  search: string;
  location: string;
  category: string;
  rentalType: string;
  priceRange: [number, number];
  inStockOnly: boolean;
  sortBy: "recent" | "price-low" | "price-high" | "rating";
}
