import { useState } from "react";

import type { ChartType, ColorTheme } from "@/features/charts/overview/types";

const STORAGE_KEY = "carsense-chart-preferences";

type ChartPreferences = {
  chartType: ChartType;
  colorTheme: ColorTheme;
};

const DEFAULT_PREFERENCES: ChartPreferences = {
  chartType: "area",
  colorTheme: "default",
};

export function useChartPreferences() {
  const [preferences, setPreferences] = useState<ChartPreferences>(() => {
    // Try to load preferences from localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
    }
    catch {
      return DEFAULT_PREFERENCES;
    }
  });

  const setChartType = (chartType: ChartType) => {
    const newPreferences = { ...preferences, chartType };
    setPreferences(newPreferences);

    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
    }
    catch (e) {
      console.error("Could not save chart preferences", e);
    }
  };

  const setColorTheme = (colorTheme: ColorTheme) => {
    const newPreferences = { ...preferences, colorTheme };
    setPreferences(newPreferences);

    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
    }
    catch (e) {
      console.error("Could not save chart preferences", e);
    }
  };

  return {
    chartType: preferences.chartType,
    colorTheme: preferences.colorTheme,
    setChartType,
    setColorTheme,
  };
}
