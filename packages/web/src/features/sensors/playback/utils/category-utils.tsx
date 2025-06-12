import type { PlaybackSensor } from "../types";

import { STANDARD_CATEGORIES } from "../../utils/sensor-categories";

// Theme-based category colors using shadcn vars
export function getCategoryColor(category: string): string {
  switch (category.toLowerCase()) {
    case "engine":
      return "hsl(var(--destructive))";
    case "temperature":
      return "hsl(var(--warning))";
    case "electrical":
      return "hsl(var(--primary))";
    case "fluid":
      return "hsl(var(--info))";
    case "emissions":
      return "hsl(var(--success))";
    default:
      return "hsl(var(--muted))";
  }
}

/**
 * Group sensors by category
 * @param sensors Array of PlaybackSensor objects
 * @returns Object mapping categories to arrays of sensors
 */
export function groupSensorsByCategory(sensors: PlaybackSensor[]): Record<string, PlaybackSensor[]> {
  const standardGroups: Record<string, PlaybackSensor[]> = {};

  // Initialize standard categories
  STANDARD_CATEGORIES.forEach((category) => {
    standardGroups[category.toLowerCase()] = [];
  });

  // Group sensors by category
  return sensors.reduce((acc, sensor) => {
    const category = sensor.category.toLowerCase();
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(sensor);
    return acc;
  }, standardGroups);
}
