import { useEffect, useMemo, useState } from "react";

import type { SensorCardData, SensorData, SensorOverviewCardsProps, SensorReading } from "../types";

import { getStandardCategory } from "../../utils/sensor-categories";
import { findSensorByPID } from "../utils";

export function useSensorData({ data, isLoading }: SensorOverviewCardsProps) {
  // State to track the current snapshot index
  const [currentSnapshotIndex, setCurrentSnapshotIndex] = useState(0);

  // Extract snapshots from data
  const snapshots = useMemo(() => {
    return data?.snapshots || [];
  }, [data?.snapshots]);

  // Reset snapshot index when snapshots change
  useEffect(() => {
    if (snapshots.length > 0) {
      setCurrentSnapshotIndex(0);
    }
  }, [snapshots]);

  // Create arrays for primary sensors based on the current snapshot
  const sensorData = useMemo(() => {
    // If there's no data or sensors, return an empty array
    if (!data || !data.sensors || !Array.isArray(data.sensors)) {
      return [];
    }

    // Get the current snapshot (with bounds checking)
    const safeSnapshotIndex = snapshots.length > 0
      ? Math.min(Math.max(0, currentSnapshotIndex), snapshots.length - 1)
      : 0;
    const currentSnapshot = snapshots.length > 0 ? snapshots[safeSnapshotIndex] : null;

    // If no snapshot or no readings, use the original sensor data
    if (!currentSnapshot || !currentSnapshot.readings || !Array.isArray(currentSnapshot.readings) || currentSnapshot.readings.length === 0) {
      return processSnapshotData(data.sensors);
    }

    try {
      // Group readings by PID
      const readingsByPid: Record<string, SensorReading[]> = {};

      // Process all readings in the current snapshot
      currentSnapshot.readings.forEach((reading) => {
        if (reading && reading.pid) {
          if (!readingsByPid[reading.pid]) {
            readingsByPid[reading.pid] = [];
          }
          readingsByPid[reading.pid].push(reading);
        }
      });

      // Sort readings by timestamp for each PID
      Object.keys(readingsByPid).forEach((pid) => {
        readingsByPid[pid].sort((a, b) => {
          try {
            return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          }
          catch (error) {
            console.error("Error sorting readings:", error);
            return 0;
          }
        });
      });

      // Update sensor data with readings from the current snapshot
      const updatedSensors = data.sensors.map((sensor) => {
        if (!sensor || !sensor.pid)
          return sensor;

        const snapshotReadings = readingsByPid[sensor.pid];

        if (snapshotReadings && snapshotReadings.length > 0) {
          // Use the most recent reading as the last value
          const mostRecentReading = snapshotReadings[snapshotReadings.length - 1];

          return {
            ...sensor,
            lastValue: mostRecentReading.value,
            // Preserve the original readings array for history charts
            readings: sensor.readings,
            // Add the snapshot readings for this sensor
            snapshotReadings,
          };
        }
        return sensor;
      });

      return processSnapshotData(updatedSensors);
    }
    catch (error) {
      console.error("Error processing snapshot data:", error);
      return processSnapshotData(data.sensors);
    }
  }, [data, snapshots, currentSnapshotIndex]);

  // Helper function to process sensor data into card data
  function processSnapshotData(sensors: SensorData[]) {
    if (!sensors || !Array.isArray(sensors)) {
      return [];
    }

    try {
      // OBD-II PID codes for common metrics
      // 0C: Engine RPM
      // 05: Engine coolant temperature
      // 2F: Fuel level
      // 42: Control module voltage (for battery)
      // 0D: Vehicle speed
      // 0B: Intake manifold pressure
      const engineRPM = findSensorByPID({ sensors }, ["0C", "0c"]);
      const temperature = findSensorByPID({ sensors }, ["05", "5"]);
      const batteryVoltage = findSensorByPID({ sensors }, ["42", "VOLTAGE"]);
      const fuelLevel = findSensorByPID({ sensors }, ["2F", "2f"]);
      const vehicleSpeed = findSensorByPID({ sensors }, ["0D", "0d"]);
      const intakeManifold = findSensorByPID({ sensors }, ["0B", "0b"]);

      // Standardize categories in the raw data first
      sensors.forEach((sensor: SensorData) => {
        if (!sensor)
          return;

        if (sensor.pid) {
          sensor.category = getStandardCategory(sensor.category || "", sensor.pid);
        }
        else if (sensor.category) {
          sensor.category = getStandardCategory(sensor.category, "");
        }
        else {
          sensor.category = "Other";
        }
      });

      const primarySensorDefinitions = [
        {
          title: "Engine RPM",
          sensor: engineRPM,
          unit: "RPM",
          categoryIcon: "gauge",
          category: "Engine",
          delay: 0,
        },
        {
          title: "Vehicle Speed",
          sensor: vehicleSpeed,
          unit: "km/h",
          categoryIcon: "gaugeCircle",
          category: "Engine",
          delay: 100,
        },
        {
          title: "Coolant Temperature",
          sensor: temperature,
          unit: "°C",
          categoryIcon: "thermometer",
          category: "Temperature",
          delay: 200,
        },
        {
          title: "Battery Voltage",
          sensor: batteryVoltage,
          unit: "V",
          categoryIcon: "battery",
          category: "Electrical",
          delay: 300,
        },
        {
          title: "Fuel Level",
          sensor: fuelLevel,
          unit: "%",
          categoryIcon: "droplet",
          category: "Fluid",
          delay: 400,
        },
        {
          title: "Intake Pressure",
          sensor: intakeManifold,
          unit: "kPa",
          categoryIcon: "barChart",
          category: "Engine",
          delay: 500,
        },
      ];

      // Filter out undefined sensors and ensure same category
      const primarySensors = primarySensorDefinitions
        .filter(item => item.sensor)
        .map((item) => {
          if (item.sensor) {
            item.sensor.category = item.category;
          }
          return item as SensorCardData;
        });

      // Get all available sensors
      const allSensors = sensors || [];

      // Get all other sensors that aren't in the primary list
      const primaryPIDs = primarySensors.map(item => item.sensor.pid);

      const secondarySensors: SensorCardData[] = allSensors
        .filter((sensor: SensorData) => sensor && sensor.pid && !primaryPIDs.includes(sensor.pid))
        .map((sensor: SensorData, index: number) => ({
          title: sensor.name || `Sensor ${sensor.pid}`,
          sensor,
          unit: sensor.unit || "",
          categoryIcon: sensor.category?.toLowerCase() || "other",
          category: sensor.category || "Other", // Use already standardized category
          delay: 600 + (index * 50), // Staggered delay after primary sensors
        }));

      // Combine all sensors into a single array
      return [...primarySensors, ...secondarySensors];
    }
    catch (error) {
      console.error("Error in processSnapshotData:", error);
      return [];
    }
  }

  return {
    isLoading,
    sensorData,
    snapshots,
    currentSnapshotIndex,
    setCurrentSnapshotIndex,
  };
}
