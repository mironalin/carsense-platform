import type { ReactNode } from "react";

import { Battery, Droplet, Gauge, GaugeCircle, Info, ThermometerIcon, Wind } from "lucide-react";

/**
 * Standard sensor categories used across the application
 */
export const STANDARD_CATEGORIES = ["Engine", "Temperature", "Electrical", "Fluid", "Emissions", "Other"];

/**
 * Map of PIDs to standardized categories
 */
export const PID_CATEGORY_MAP: Record<string, string> = {
  // Engine-related
  "04": "Engine", // Calculated engine load
  "05": "Temperature", // Engine coolant temperature
  "0A": "Engine", // Fuel pressure
  "0B": "Engine", // Intake manifold pressure
  "0C": "Engine", // RPM
  "0D": "Engine", // Vehicle Speed
  "0E": "Engine", // Timing advance
  "0F": "Temperature", // Intake air temperature
  "10": "Engine", // MAF air flow rate
  "11": "Engine", // Throttle position

  // Climate/Temperature-related
  "46": "Temperature", // Ambient Air Temperature
  "5C": "Temperature", // Oil temperature

  // Fluid-related
  "2F": "Fluid", // Fuel Level
  "3E": "Fluid", // Fuel Pressure

  // Electrical-related
  "42": "Electrical", // Control Module Voltage
  "5D": "Electrical", // Battery Status

  // Emissions-related
  "01": "Emissions", // Fuel System Status
  "03": "Emissions", // Fuel System Status
  "07": "Emissions", // Long term fuel trim
  "08": "Emissions", // Short term fuel trim
  "09": "Emissions", // Fuel system status
};

/**
 * OBD-II PID friendly names mapping
 */
export const PID_FRIENDLY_NAMES: Record<string, string> = {
  "01": "Monitor Status",
  "02": "Freeze DTC",
  "03": "Fuel System Status",
  "04": "Engine Load",
  "05": "Coolant Temperature",
  "06": "Short Term Fuel Trim",
  "07": "Long Term Fuel Trim",
  "08": "Short Term Fuel Trim",
  "09": "Long Term Fuel Trim",
  "0A": "Fuel Pressure",
  "0B": "Intake Manifold Pressure",
  "0C": "Engine RPM",
  "0D": "Vehicle Speed",
  "0E": "Timing Advance",
  "0F": "Intake Air Temperature",
  "10": "MAF Air Flow Rate",
  "11": "Throttle Position",
  "12": "Commanded Secondary Air Status",
  // ... more PIDs (omitted for brevity) ...
  "42": "Control Module Voltage",
  "46": "Ambient Air Temperature",
  "5C": "Engine Oil Temperature",
  "5D": "Battery Status",
};

/**
 * Function to normalize category names to title case
 */
export function normalizeCategory(category: string): string {
  if (!category) {
    return "Other";
  }

  // Convert to title case
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
}

/**
 * Function to get consistent categories for known sensor types
 */
export function getStandardCategory(sensorType: string, pid: string): string {
  // First check if we have a mapping for this PID
  if (pid && PID_CATEGORY_MAP[pid]) {
    return PID_CATEGORY_MAP[pid];
  }

  // Otherwise normalize the provided category
  return normalizeCategory(sensorType) || "Other";
}

/**
 * Get category icon name for consistent icon usage
 */
export function getCategoryIconName(category: string): string {
  // Use lowercase comparison for icon selection
  switch (category?.toLowerCase()) {
    case "engine":
      return "gauge";
    case "temperature":
      return "thermometer";
    case "electrical":
      return "battery";
    case "fluid":
      return "droplet";
    case "emissions":
      return "wind";
    default:
      return "info";
  }
}

/**
 * Get category icon as React component
 */
export function getCategoryIcon(category: string, className: string = "size-4"): ReactNode {
  // Use lowercase comparison for icon selection
  const iconType = category?.toLowerCase() || "";

  switch (iconType) {
    case "engine":
      return <Gauge className={className} />;
    case "temperature":
      return <ThermometerIcon className={className} />;
    case "electrical":
      return <Battery className={className} />;
    case "fluid":
      return <Droplet className={className} />;
    case "emissions":
      return <Wind className={className} />;
    case "gauge":
      return <Gauge className={className} />;
    case "gaugecircle":
      return <GaugeCircle className={className} />;
    default:
      return <Info className={className} />;
  }
}

/**
 * Helper function to standardize sensors with categories
 */
export function standardizeSensors<T extends { pid?: string; category?: string }>(sensors: T[]): T[] {
  return sensors.map((sensor) => {
    const newSensor = { ...sensor };

    if (sensor.pid) {
      newSensor.category = getStandardCategory(sensor.category || "", sensor.pid);
    }
    else if (sensor.category) {
      newSensor.category = normalizeCategory(sensor.category);
    }
    else {
      newSensor.category = "Other";
    }

    return newSensor;
  });
}

/**
 * Helper function to group sensors by category
 */
export function groupSensorsByCategory<T extends { pid?: string; category?: string }>(
  sensors: T[],
): Record<string, T[]> {
  const categories: Record<string, T[]> = {};

  // Initialize standard categories
  STANDARD_CATEGORIES.forEach((category) => {
    categories[category.toLowerCase()] = [];
  });

  sensors.forEach((sensor) => {
    const category = (sensor.category || "Other").toLowerCase();
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(sensor);
  });

  return categories;
}

/**
 * Helper function to filter sensors by category
 */
export function filterSensorsByCategory<T extends { category?: string }>(
  sensors: T[],
  category: string,
): T[] {
  if (category === "all") {
    return sensors;
  }
  return sensors.filter(s => s.category === category);
}
