import type { DataFreshness, SensorData, SensorOverviewCardsProps, SensorReading } from "../types";

import { getStandardCategory } from "../../utils/sensor-categories";

/**
 * Calculate data freshness based on last reading time
 */
export function getDataFreshness(timestamp: string | null | undefined): DataFreshness {
  if (!timestamp)
    return "stale";

  const now = new Date();
  const lastUpdate = new Date(timestamp);
  const diff = now.getTime() - lastUpdate.getTime();

  if (diff < 30000) { // Less than 30 seconds
    return "recent";
  }
  else if (diff < 300000) { // Less than 5 minutes
    return "recent";
  }
  else {
    return "stale";
  }
}

/**
 * Format timestamp to local time
 */
export function formatTimestamp(timestamp: string): string {
  if (!timestamp)
    return "N/A";

  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
}

/**
 * Get a summary of sensor readings
 */
export function getSensorSummary(readings: SensorReading[]): {
  lastUpdate: string | null;
  lastValue: number | null;
  minValue: number | null;
  maxValue: number | null;
  change: number | null;
  changeDirection: "up" | "down" | "stable" | null;
} {
  if (!readings || readings.length === 0) {
    return {
      lastUpdate: null,
      lastValue: null,
      minValue: null,
      maxValue: null,
      change: null,
      changeDirection: null,
    };
  }

  // Sort by timestamp
  const sortedReadings = [...readings].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const lastReading = sortedReadings[0];
  const lastValue = lastReading?.value || null;
  const lastUpdate = lastReading?.timestamp || null;

  // Get min and max values
  const validValues = sortedReadings
    .map(reading => reading.value)
    .filter((value): value is number => value !== null);

  const minValue = validValues.length ? Math.min(...validValues) : null;
  const maxValue = validValues.length ? Math.max(...validValues) : null;

  // Calculate change trend (compare last value with average of previous 3)
  let change = null;
  let changeDirection: "up" | "down" | "stable" | null = null;

  if (sortedReadings.length >= 2 && lastValue !== null) {
    const previousValues = sortedReadings.slice(1, Math.min(4, sortedReadings.length))
      .filter(reading => reading.value !== null);

    if (previousValues.length > 0) {
      const previousAvg = previousValues.reduce((sum, reading) => sum + (reading.value || 0), 0) / previousValues.length;
      change = lastValue - previousAvg;

      if (Math.abs(change) < 0.001) {
        changeDirection = "stable";
      }
      else if (change > 0) {
        changeDirection = "up";
      }
      else {
        changeDirection = "down";
      }
    }
  }

  return {
    lastUpdate,
    lastValue,
    minValue,
    maxValue,
    change,
    changeDirection,
  };
}

// Format relative time (e.g., "5 minutes ago")
export function getRelativeTime(timestamp: string | undefined): string {
  if (!timestamp) {
    return "No data";
  }

  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();

  // Convert to seconds
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) {
    return `${diffSec} seconds ago`;
  }
  if (diffSec < 3600) {
    return `${Math.floor(diffSec / 60)} minutes ago`;
  }
  if (diffSec < 86400) {
    return `${Math.floor(diffSec / 3600)} hours ago`;
  }
  return `${Math.floor(diffSec / 86400)} days ago`;
}

// Calculate progress percentage for gauge visualization
export function calculateProgress(value: number | null, min: number | null, max: number | null): number {
  // Handle null values
  if (value === null) {
    return 0;
  }

  // Use 0 as default min if null/undefined
  const safeMin = min ?? 0;
  // Use a reasonable default max if null/undefined
  const safeMax = max ?? 100;

  // Handle equal min/max (avoid division by zero)
  if (safeMin === safeMax) {
    return 50; // Return 50% when min equals max to show something
  }

  // Simple linear calculation that works for all values including zero
  const percentage = ((value - safeMin) / (safeMax - safeMin)) * 100;

  // Ensure we return a valid percentage between 0-100
  return Math.max(0, Math.min(100, percentage));
}

// Calculate trend from readings
export function calculateTrend(readings: SensorReading[] | undefined): "up" | "down" | "stable" | undefined {
  if (!readings || readings.length < 2) {
    return undefined;
  }

  // Sort readings by timestamp
  const sortedReadings = [...readings]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10); // Use latest 10 readings

  if (sortedReadings.length < 2) {
    return undefined;
  }

  const latest = sortedReadings[0].value;
  const previous = sortedReadings[1].value;

  if (latest === null || previous === null) {
    return undefined;
  }

  if (latest > previous * 1.05) {
    return "up"; // 5% increase
  }
  if (latest < previous * 0.95) {
    return "down"; // 5% decrease
  }
  return "stable";
}

// Helper function to find specific sensors by PID
export function findSensorByPID(
  data: SensorOverviewCardsProps["data"] | { sensors: SensorData[] },
  pidCodes: string[],
): SensorData | null {
  if (!data?.sensors || !Array.isArray(data.sensors)) {
    return null;
  }

  // Look for exact matches with OBD-II PIDs
  for (const pid of pidCodes) {
    const exactMatch = data.sensors.find(s => s.pid === pid);

    if (exactMatch) {
      // Apply standard categorization when we find the sensor
      if (exactMatch.pid) {
        exactMatch.category = getStandardCategory(exactMatch.category || "", exactMatch.pid);
      }
      return exactMatch;
    }
  }

  return null;
}
