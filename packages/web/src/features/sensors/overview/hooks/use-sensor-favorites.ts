import { useState } from "react";

const STORAGE_KEY = "carsense-favorite-sensors";

export function useSensorFavorites() {
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

  const toggleFavorite = (sensorId: string) => {
    const newFavorites = favorites.includes(sensorId)
      ? favorites.filter(id => id !== sensorId)
      : [...favorites, sensorId];

    setFavorites(newFavorites);

    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
    }
    catch (e) {
      console.error("Could not save favorites", e);
    }
  };

  const isFavorite = (sensorId: string) => favorites.includes(sensorId);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
}
