import type { NormalizedDataPoint, Sensor, SensorData } from "@/features/charts/types";

/**
 * Normalizes data points across multiple diagnostic sessions for comparison
 * Instead of using timestamps (which differ across sessions), we normalize by index
 * This ensures the charts show data points aligned for better comparison
 */
export function generateComparisonChartData(
  sensorId: string,
  sessionData: Record<string, SensorData | undefined>,
  sessionLabels: Record<string, string>,
  colors: string[],
) {
  // Find the sensor in each session
  const sessionsWithSensor: Record<string, {
    sensor: Sensor;
    color: string;
    label: string;
  }> = {};

  // Collect sensor data from each session
  Object.entries(sessionData).forEach(([sessionId, data], index) => {
    if (!data)
      return;

    const sensor = data.sensors.find(s => s.pid === sensorId);
    if (!sensor || !sensor.readings || sensor.readings.length === 0)
      return;

    sessionsWithSensor[sessionId] = {
      sensor,
      color: colors[index % colors.length],
      label: sessionLabels[sessionId] || `Session ${index + 1}`,
    };
  });

  if (Object.keys(sessionsWithSensor).length === 0) {
    return { normalizedData: [], sensorInfo: null };
  }

  // Get sensor metadata from the first available session
  const firstSessionId = Object.keys(sessionsWithSensor)[0];
  const sensorInfo = sessionsWithSensor[firstSessionId].sensor;

  // Create a normalized index for each session's data points
  // This ensures that data points are aligned by their position in the sequence,
  // not by their actual timestamps which may differ across sessions
  const sessionReadings: Record<string, Array<{ value: number; timestamp: string; odometer?: number }>> = {};

  // First, collect and sort all readings by session
  Object.entries(sessionsWithSensor).forEach(([sessionId, { sensor }]) => {
    // Sort readings by timestamp
    const sortedReadings = [...sensor.readings].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

    sessionReadings[sessionId] = sortedReadings.map(reading => ({
      value: reading.value,
      timestamp: reading.timestamp,
      odometer: reading.odometer,
    }));
  });

  // Find the maximum number of readings in any session
  const maxReadings = Math.max(...Object.values(sessionReadings).map(readings => readings.length));

  // Create normalized data points
  const normalizedData: NormalizedDataPoint[] = [];
  for (let i = 0; i < maxReadings; i++) {
    // Make sure index is a number, not a string
    const point: NormalizedDataPoint = {
      index: i,
      pointNumber: i + 1, // 1-indexed for display
      timestamp: "", // Will be set from the first session with data at this index
      sessionTimestamps: {}, // Store original timestamps for each session
    };

    // Add data from each session at this index
    Object.entries(sessionReadings).forEach(([sessionId, readings]) => {
      if (i < readings.length) {
        const reading = readings[i];
        point[sessionId] = reading.value;

        // Store the original timestamp for this session
        if (point.sessionTimestamps) {
          point.sessionTimestamps[sessionId] = reading.timestamp;
        }

        // Use the timestamp from the first session for reference
        if (!point.timestamp) {
          point.timestamp = reading.timestamp;
        }
      }
    });

    normalizedData.push(point);
  }

  return {
    normalizedData,
    sensorInfo,
    sessionInfo: Object.entries(sessionsWithSensor).map(([sessionId, info]) => ({
      id: sessionId,
      label: info.label,
      color: info.color,
    })),
  };
}

/**
 * Adapts comparison data to the format expected by the existing chart components
 */
export function adaptComparisonDataForCharts(
  normalizedData: NormalizedDataPoint[],
  sessionId: string,
  sensorInfo: Sensor | null,
) {
  if (!sensorInfo)
    return [];

  return normalizedData
    .filter(point => point[sessionId] !== undefined)
    .map(point => ({
      timestamp: point.timestamp,
      value: point[sessionId] as number,
      unit: sensorInfo.unit || "",
      index: point.index,
      pointNumber: point.pointNumber, // Include the 1-indexed point number
    }));
}
