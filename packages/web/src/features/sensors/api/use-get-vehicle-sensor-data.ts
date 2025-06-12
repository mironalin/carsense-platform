import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";

export type SensorFilter = {
  pid?: string[];
  timeRange?: {
    start?: Date;
    end?: Date;
    preset?: "1h" | "24h" | "7d" | "30d" | "custom";
  };
  diagnosticId?: string; // Add filter for specific diagnostic session
};

// Function to fetch sensor snapshots for a given diagnostic
export async function getSensorSnapshotsQuery(diagnosticId: string, includeReadings: "true" | "false" = "true") {
  const response = await api.diagnostics[":diagnosticUUID"].snapshots.$get({
    param: { diagnosticUUID: diagnosticId },
    query: { includeReadings },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sensor snapshots: ${response.statusText}`);
  }

  return response.json();
}

// Function to fetch sensor readings for a specific snapshot
export async function getSensorReadingsForSnapshotQuery(diagnosticId: string, snapshotId: string) {
  const response = await api.diagnostics[":diagnosticUUID"].snapshots[":snapshotUUID"].$get({
    param: { diagnosticUUID: diagnosticId, snapshotUUID: snapshotId },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sensor readings: ${response.statusText}`);
  }

  return response.json();
}

// Function to fetch all sensor data for a vehicle
export async function getVehicleSensorDataQuery(vehicleId: string, filter?: SensorFilter) {
  // First, get all diagnostics for the vehicle
  const diagnosticsResponse = await api.vehicles[":vehicleUUID"].diagnostics.$get({
    param: { vehicleUUID: vehicleId },
  });

  if (!diagnosticsResponse.ok) {
    throw new Error(`Failed to fetch vehicle diagnostics: ${diagnosticsResponse.statusText}`);
  }

  const diagnostics = await diagnosticsResponse.json();

  // Filter diagnostics if diagnosticId is provided
  const filteredDiagnostics = filter?.diagnosticId
    ? diagnostics.filter((diagnostic: any) => diagnostic.uuid === filter.diagnosticId)
    : diagnostics;

  // For each diagnostic, get sensor snapshots with readings
  const sensorData = await Promise.all(
    filteredDiagnostics.map(async (diagnostic: any) => {
      const snapshotsData = await getSensorSnapshotsQuery(diagnostic.uuid, "true");
      return {
        diagnostic,
        snapshots: snapshotsData.snapshots || [],
      };
    }),
  );

  // Process the data: organize sensors by category, calculate stats, etc.
  return processSensorData(sensorData, filter);
}

// Helper function to process and organize the sensor data
function processSensorData(sensorData: any[], filter?: SensorFilter) {
  const allSensors: { [key: string]: any } = {};
  const readings: any[] = [];
  const categories: { [key: string]: string[] } = {
    Engine: [],
    Temperature: [],
    Electrical: [],
    Fluid: [],
    Emissions: [],
    Other: [],
  };

  // Collect all snapshots across all diagnostics
  const allSnapshots: any[] = [];

  // OBD-II PID category mapping
  // Map standard OBD-II PIDs to categories
  const obdPIDCategories: { [key: string]: string } = {
    // Engine sensors
    "04": "Engine", // Calculated engine load
    "05": "Temperature", // Engine coolant temperature (was "engine")
    "0A": "Engine", // Fuel pressure
    "0B": "Engine", // Intake manifold pressure
    "0C": "Engine", // Engine RPM
    "0D": "Engine", // Vehicle speed
    "0E": "Engine", // Timing advance
    "0F": "Temperature", // Intake air temperature (was "engine")
    "10": "Engine", // MAF air flow rate
    "11": "Engine", // Throttle position

    // Electrical systems
    "42": "Electrical", // Control module voltage

    // Fuel and emissions
    "2F": "Fluid", // Fuel level input
    "3C": "Fluid", // Catalyst temperature
    "51": "Fluid", // Fuel type

    // Emissions related
    "01": "Emissions", // Status since DTCs cleared
    "02": "Emissions", // Freeze DTC
    "07": "Emissions", // Long term fuel trim
    "08": "Emissions", // Short term fuel trim
    "09": "Emissions", // Fuel system status

    // Climate control/Temperature
    "46": "Temperature", // Ambient air temperature (was "climate")
    "5C": "Temperature", // Oil temperature (was "climate")
  };

  // OBD-II PID friendly names mapping
  const obdPIDNames: { [key: string]: string } = {
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
    "13": "Oxygen Sensors Present",
    "14": "Oxygen Sensor 1",
    "15": "Oxygen Sensor 2",
    "16": "Oxygen Sensor 3",
    "17": "Oxygen Sensor 4",
    "18": "Oxygen Sensor 5",
    "19": "Oxygen Sensor 6",
    "1A": "Oxygen Sensor 7",
    "1B": "Oxygen Sensor 8",
    "1C": "OBD Standards",
    "1D": "Oxygen Sensors Present",
    "1E": "Auxiliary Input Status",
    "1F": "Run Time Since Engine Start",
    "20": "PIDs Supported [21-40]",
    "21": "Distance With MIL On",
    "22": "Fuel Rail Pressure",
    "23": "Fuel Rail Gauge Pressure",
    "24": "Oxygen Sensor 1",
    "25": "Oxygen Sensor 2",
    "26": "Oxygen Sensor 3",
    "27": "Oxygen Sensor 4",
    "28": "Oxygen Sensor 5",
    "29": "Oxygen Sensor 6",
    "2A": "Oxygen Sensor 7",
    "2B": "Oxygen Sensor 8",
    "2C": "Commanded EGR",
    "2D": "EGR Error",
    "2E": "Commanded Evaporative Purge",
    "2F": "Fuel Level Input",
    "30": "Warm-ups Since Codes Cleared",
    "31": "Distance Since Codes Cleared",
    "32": "Evap System Vapor Pressure",
    "33": "Barometric Pressure",
    "34": "Oxygen Sensor 1",
    "35": "Oxygen Sensor 2",
    "36": "Oxygen Sensor 3",
    "37": "Oxygen Sensor 4",
    "38": "Oxygen Sensor 5",
    "39": "Oxygen Sensor 6",
    "3A": "Oxygen Sensor 7",
    "3B": "Oxygen Sensor 8",
    "3C": "Catalyst Temperature",
    "3D": "Catalyst Temperature",
    "3E": "Catalyst Temperature",
    "3F": "Catalyst Temperature",
    "40": "PIDs Supported [41-60]",
    "41": "Monitor Status This Drive Cycle",
    "42": "Control Module Voltage",
    "43": "Absolute Load Value",
    "44": "Commanded Equivalence Ratio",
    "45": "Relative Throttle Position",
    "46": "Ambient Air Temperature",
    "47": "Absolute Throttle Position B",
    "48": "Absolute Throttle Position C",
    "49": "Accelerator Pedal Position D",
    "4A": "Accelerator Pedal Position E",
    "4B": "Accelerator Pedal Position F",
    "4C": "Commanded Throttle Actuator",
    "4D": "Time With MIL On",
    "4E": "Time Since Codes Cleared",
    "4F": "Maximum Values",
    "50": "Maximum Air Flow Rate",
    "51": "Fuel Type",
    "52": "Ethanol Fuel Percentage",
    "53": "Absolute Evap System Vapor Pressure",
    "54": "Evap System Vapor Pressure",
    "55": "Short Term Secondary Oxygen Sensor Trim",
    "56": "Long Term Secondary Oxygen Sensor Trim",
    "57": "Short Term Secondary Oxygen Sensor Trim",
    "58": "Long Term Secondary Oxygen Sensor Trim",
    "59": "Fuel Rail Absolute Pressure",
    "5A": "Relative Accelerator Pedal Position",
    "5B": "Hybrid Battery Pack Remaining Life",
    "5C": "Engine Oil Temperature",
    "5D": "Fuel Injection Timing",
    "5E": "Engine Fuel Rate",
    "5F": "Emission Requirements",
  };

  // Store all diagnostics for reference
  const diagnostics = sensorData.map(item => item.diagnostic);

  // Extract all sensor readings and organize them
  sensorData.forEach(({ diagnostic, snapshots }) => {
    // Add snapshots to the collection
    snapshots.forEach((snapshot: any) => {
      allSnapshots.push({
        ...snapshot,
        diagnosticUUID: diagnostic.uuid,
      });

      if (snapshot.readings) {
        snapshot.readings.forEach((reading: any) => {
          // Apply PID filter if specified
          if (filter?.pid && filter.pid.length > 0 && !filter.pid.includes(reading.pid)) {
            return;
          }

          // Apply time range filter if specified
          if (filter?.timeRange) {
            const readingDate = new Date(reading.timestamp);
            if (filter.timeRange.start && readingDate < filter.timeRange.start)
              return;
            if (filter.timeRange.end && readingDate > filter.timeRange.end)
              return;
          }

          // Store the reading with diagnostic context
          readings.push({
            ...reading,
            diagnosticUUID: diagnostic.uuid,
            snapshotUUID: snapshot.uuid,
            odometer: diagnostic.odometer,
          });

          // Track unique sensors
          if (!allSensors[reading.pid]) {
            // Determine category based on OBD-II PID code
            const category = obdPIDCategories[reading.pid] || "Other";

            // Get friendly name for the PID
            const friendlyName = obdPIDNames[reading.pid] || `Sensor ${reading.pid}`;

            // Create sensor object
            allSensors[reading.pid] = {
              pid: reading.pid,
              name: friendlyName,
              unit: reading.unit,
              category,
              readings: [],
              lastValue: null,
              minValue: null,
              maxValue: null,
            };

            // Add to category
            categories[category].push(reading.pid);
          }

          // Add reading to sensor
          allSensors[reading.pid].readings.push({
            value: reading.value,
            timestamp: reading.timestamp,
            diagnosticUUID: diagnostic.uuid,
            snapshotUUID: snapshot.uuid,
            odometer: diagnostic.odometer,
          });

          // Update stats
          const value = reading.value;
          allSensors[reading.pid].lastValue = value;

          if (allSensors[reading.pid].minValue === null || value < allSensors[reading.pid].minValue) {
            allSensors[reading.pid].minValue = value;
          }

          if (allSensors[reading.pid].maxValue === null || value > allSensors[reading.pid].maxValue) {
            allSensors[reading.pid].maxValue = value;
          }
        });
      }
    });
  });

  // Sort readings by timestamp
  readings.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Convert sensors object to array
  const sensors = Object.values(allSensors);

  // Sort sensors by category and then by PID
  sensors.sort((a: any, b: any) => {
    if (a.category === b.category) {
      return a.pid.localeCompare(b.pid);
    }
    return a.category.localeCompare(b.category);
  });

  // Sort snapshots by timestamp (oldest first)
  allSnapshots.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return {
    sensors,
    categories,
    readings,
    diagnostics,
    snapshots: allSnapshots,
    stats: {
      totalSensors: sensors.length,
      totalReadings: readings.length,
      readingsPerCategory: Object.keys(categories).reduce((acc, cat) => {
        acc[cat] = categories[cat].length;
        return acc;
      }, {} as { [key: string]: number }),
    },
  };
}

// React Query hook
export function useGetVehicleSensorData(vehicleId: string, filter?: SensorFilter) {
  return useQuery({
    queryKey: ["vehicles", vehicleId, "sensors", filter],
    queryFn: () => getVehicleSensorDataQuery(vehicleId, filter),
    enabled: !!vehicleId,
  });
}

// Query options for loader usage
export function getVehicleSensorDataQueryOptions(vehicleId: string, filter?: SensorFilter) {
  return queryOptions({
    queryKey: ["vehicles", vehicleId, "sensors", filter],
    queryFn: () => getVehicleSensorDataQuery(vehicleId, filter),
  });
}
