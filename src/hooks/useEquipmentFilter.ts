"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Equipment } from "@/types";
import { equipmentApi } from "@/lib/api";

export interface FilterCriteria {
  search: string;
  category: string;
  location: string;
  rentalType: string;
  maxPrice: number;
  inStockOnly: boolean;
  verifiedOnly: boolean;
  sortBy: "recent" | "price-low" | "price-high" | "rating";
}

export function useEquipmentFilter(
  fallbackEquipmentList: Equipment[],
  initialCriteria?: Partial<FilterCriteria>
) {
  const [criteria, setCriteria] = useState<FilterCriteria>({
    search: initialCriteria?.search || "",
    category: initialCriteria?.category || "All",
    location: initialCriteria?.location || "",
    rentalType: initialCriteria?.rentalType || "all",
    maxPrice: initialCriteria?.maxPrice || 1500,
    inStockOnly: initialCriteria?.inStockOnly || false,
    verifiedOnly: initialCriteria?.verifiedOnly || false,
    sortBy: initialCriteria?.sortBy || "recent",
  });

  const updateCriteria = <K extends keyof FilterCriteria>(
    key: K,
    value: FilterCriteria[K]
  ) => {
    setCriteria((prev) => ({ ...prev, [key]: value }));
  };

  const resetCriteria = () => {
    setCriteria({
      search: "",
      category: "All",
      location: "",
      rentalType: "all",
      maxPrice: 1500,
      inStockOnly: false,
      verifiedOnly: false,
      sortBy: "recent",
    });
  };

  // Build server query parameters
  const serverParams = useMemo(() => {
    const params: Record<string, any> = {
      limit: 30,
    };

    if (criteria.search.trim()) {
      params.search = criteria.search.trim();
    }
    if (criteria.category && criteria.category !== "All") {
      params.category = criteria.category;
    }
    if (criteria.location.trim()) {
      params.location = criteria.location.trim();
    }
    if (criteria.rentalType && criteria.rentalType !== "all") {
      params.rentalType =
        criteria.rentalType === "daily"
          ? "Daily"
          : criteria.rentalType === "weekly"
          ? "Weekly"
          : criteria.rentalType === "monthly"
          ? "Monthly"
          : criteria.rentalType;
    }
    if (criteria.maxPrice && criteria.maxPrice < 1500) {
      params.maxPrice = criteria.maxPrice;
    }
    if (criteria.inStockOnly) {
      params.available = true;
    }

    if (criteria.sortBy === "price-low") {
      params.sort = "price_asc";
    } else if (criteria.sortBy === "price-high") {
      params.sort = "price_desc";
    } else if (criteria.sortBy === "rating") {
      params.sort = "rating";
    } else {
      params.sort = "newest";
    }

    return params;
  }, [criteria]);

  // Execute server-side search and filtering via TanStack Query
  const { data: serverData, isLoading, isError } = useQuery({
    queryKey: ["equipmentCatalog", serverParams],
    queryFn: () => equipmentApi.getEquipment(serverParams),
    staleTime: 30000,
  });

  // Client-side fallback if server returns empty or during initial render
  const localFilteredFallback = useMemo(() => {
    return fallbackEquipmentList
      .filter((eq) => {
        if (criteria.search.trim()) {
          const q = criteria.search.toLowerCase();
          const matchTitle = eq.title.toLowerCase().includes(q);
          const matchBrand = eq.brand.toLowerCase().includes(q);
          const matchModel = eq.model.toLowerCase().includes(q);
          if (!matchTitle && !matchBrand && !matchModel) return false;
        }

        if (criteria.category !== "All" && eq.category !== criteria.category) {
          return false;
        }

        if (criteria.location.trim()) {
          const loc = criteria.location.toLowerCase();
          if (!eq.location.toLowerCase().includes(loc)) return false;
        }

        if (criteria.rentalType !== "all" && eq.rentalType !== criteria.rentalType) {
          return false;
        }

        if (eq.rentalPrice > criteria.maxPrice) {
          return false;
        }

        if (criteria.inStockOnly && eq.availableQuantity < 1) {
          return false;
        }

        if (criteria.verifiedOnly && !eq.ownerVerified) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (criteria.sortBy === "price-low") return a.rentalPrice - b.rentalPrice;
        if (criteria.sortBy === "price-high") return b.rentalPrice - a.rentalPrice;
        if (criteria.sortBy === "rating") return b.rating - a.rating;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [fallbackEquipmentList, criteria]);

  const filteredEquipment = useMemo<Equipment[]>(() => {
    if (serverData && serverData.equipment && serverData.equipment.length > 0) {
      return serverData.equipment;
    }
    if (serverData && serverData.equipment && serverData.equipment.length === 0 && !isError) {
      // Server returned 0 matching records for current filters
      return [];
    }
    return localFilteredFallback;
  }, [serverData, isError, localFilteredFallback]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (criteria.search.trim()) count++;
    if (criteria.category !== "All") count++;
    if (criteria.location.trim()) count++;
    if (criteria.rentalType !== "all") count++;
    if (criteria.maxPrice < 1500) count++;
    if (criteria.inStockOnly) count++;
    if (criteria.verifiedOnly) count++;
    return count;
  }, [criteria]);

  return {
    criteria,
    updateCriteria,
    resetCriteria,
    filteredEquipment,
    activeFiltersCount,
    isLoading,
  };
}
