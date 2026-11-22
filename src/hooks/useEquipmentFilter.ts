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

  // Return server equipment or empty array if loading / no items
  const filteredEquipment = useMemo<Equipment[]>(() => {
    if (serverData && Array.isArray(serverData.equipment)) {
      return serverData.equipment;
    }
    return [];
  }, [serverData]);

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
