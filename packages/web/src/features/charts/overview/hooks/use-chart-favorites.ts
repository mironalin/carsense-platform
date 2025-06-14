import { useState } from "react";

const STORAGE_KEY = "carsense-favorite-charts";

export function useChartFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    // Try to load favorites from localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    }
    catch {
      return [];
    }
  });

  const toggleFavorite = (chartId: string) => {
    const newFavorites = favorites.includes(chartId)
      ? favorites.filter(id => id !== chartId)
      : [...favorites, chartId];

    setFavorites(newFavorites);

    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
    }
    catch (e) {
      console.error("Could not save chart favorites", e);
    }
  };

  const isFavorite = (chartId: string) => favorites.includes(chartId);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
} 