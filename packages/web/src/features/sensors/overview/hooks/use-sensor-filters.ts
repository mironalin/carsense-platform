import { useMemo, useState } from "react";

import type { SensorCardData } from "../types";

export function useSensorFilters(
  allSensors: SensorCardData[],
  favorites: string[],
) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Get all unique categories for filter buttons
  const uniqueCategories = useMemo(() =>
    Array.from(new Set(allSensors.map(sensor => sensor.category))).sort(), [allSensors]);

  // Filter sensors based on search, category, and favorites
  const filteredSensors = useMemo(() =>
    allSensors.filter((sensor: SensorCardData) => {
      // Skip if we're showing favorites only and this isn't a favorite
      if (showFavoritesOnly && !favorites.includes(sensor.sensor.pid || "")) {
        return false;
      }

      // Skip if we have category filters and this sensor's category isn't selected
      if (selectedCategories.length > 0 && !selectedCategories.includes(sensor.category)) {
        return false;
      }

      // Skip if we have a search term and it doesn't match the title
      if (searchTerm && !sensor.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      return true;
    }), [allSensors, searchTerm, selectedCategories, showFavoritesOnly, favorites]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setShowFavoritesOnly(false);
  };

  // Safe wrapper for setSelectedCategories to ensure it's always an array
  const safeSetSelectedCategories = (categories: string[]) => {
    setSelectedCategories(categories || []);
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedCategories,
    setSelectedCategories: safeSetSelectedCategories,
    showFavoritesOnly,
    setShowFavoritesOnly,
    uniqueCategories,
    filteredSensors,
    resetFilters,
  };
}
