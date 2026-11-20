"use client";

import { useState, useMemo } from "react";
import { Equipment } from "@/types";

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
  equipmentList: Equipment[],
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

  const filteredEquipment = useMemo(() => {
    return equipmentList
      .filter((eq) => {
        // Keyword Search (title, brand, model)
        if (criteria.search.trim()) {
          const q = criteria.search.toLowerCase();
          const matchTitle = eq.title.toLowerCase().includes(q);
          const matchBrand = eq.brand.toLowerCase().includes(q);
          const matchModel = eq.model.toLowerCase().includes(q);
          if (!matchTitle && !matchBrand && !matchModel) return false;
        }

        // Category Filter
        if (criteria.category !== "All" && eq.category !== criteria.category) {
          return false;
        }

        // Location Filter
        if (criteria.location.trim()) {
          const loc = criteria.location.toLowerCase();
          if (!eq.location.toLowerCase().includes(loc)) return false;
        }

        // Rental Type Filter
        if (criteria.rentalType !== "all" && eq.rentalType !== criteria.rentalType) {
          return false;
        }

        // Max Price Filter
        if (eq.rentalPrice > criteria.maxPrice) {
          return false;
        }

        // In Stock Filter
        if (criteria.inStockOnly && eq.availableQuantity < 1) {
          return false;
        }

        // Verified Owner Filter
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
  }, [equipmentList, criteria]);

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
  };
}
