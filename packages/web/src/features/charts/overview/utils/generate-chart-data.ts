import type { Sensor } from "../types";

/**
 * Generates chart data from sensor readings
 * @param sensor The sensor object with readings
 * @returns Array of data points for the chart
 */
export function generateSensorChartData(sensor: Sensor) {
  if (!sensor.readings || sensor.readings.length === 0) {
    return [];
  }

  // Sort readings by timestamp (oldest first)
  const sortedReadings = [...sensor.readings].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  // Map readings to chart data points
  return sortedReadings.map(reading => ({
    timestamp: reading.timestamp,
    value: reading.value,
    unit: sensor.unit || "",
    diagnostic: reading.diagnosticUUID,
    odometer: reading.odometer,
  }));
}
