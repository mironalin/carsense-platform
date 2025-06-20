import { useQuery } from "@tanstack/react-query";

import { PID_CATEGORY_MAP, PID_FRIENDLY_NAMES } from "@/features/sensors/utils/sensor-categories";
import { api } from "@/lib/rpc";

type GetDiagnosticDataParams = {
  vehicleId: string;
  diagnosticIds: string[];
  startDate?: Date;
  endDate?: Date;
  includeAllData?: boolean;
};

// Fetch sensor snapshots for a given diagnostic
async function getSensorSnapshotsQuery(diagnosticId: string, includeReadings: "true" | "false" = "true") {
  const response = await api.diagnostics[":diagnosticUUID"].snapshots.$get({
    param: { diagnosticUUID: diagnosticId },
    query: { includeReadings },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sensor snapshots: ${response.statusText}`);
  }

  return response.json();
}

export async function getDiagnosticDataQuery({
  vehicleId,
  diagnosticIds,
  startDate,
  endDate,
  includeAllData = false,
}: GetDiagnosticDataParams) {
  if (!vehicleId || !diagnosticIds.length) {
    return { data: [], dateRange: { min: null, max: null } };
  }

  try {
    // First, get diagnostics for the vehicle
    const diagnosticsResponse = await api.vehicles[":vehicleUUID"].diagnostics.$get({
      param: { vehicleUUID: vehicleId },
    });

    if (!diagnosticsResponse.ok) {
      throw new Error(`Failed to fetch vehicle diagnostics: ${diagnosticsResponse.statusText}`);
    }

    const allDiagnostics = await diagnosticsResponse.json();

    // Filter diagnostics by the selected IDs
    const filteredDiagnostics = allDiagnostics.filter((diag: any) =>
      diagnosticIds.includes(diag.uuid),
    );

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

    // Process the data to a format suitable for export
    const processedData = processDataForExport(sensorData, startDate, endDate, includeAllData);

    // Find the min and max dates in all the diagnostic data
    const dateRange = findDateRange(sensorData);

    return {
      data: processedData,
      dateRange,
    };
  }
  catch (error) {
    console.error("Error fetching diagnostic data:", error);
    throw error;
  }
}

/**
 * Find the minimum and maximum dates in the diagnostic data
 */
function findDateRange(sensorData: any[]) {
  let minDate: Date | null = null;
  let maxDate: Date | null = null;

  // Iterate through all diagnostics and their snapshots to find min/max dates
  sensorData.forEach(({ snapshots }) => {
    snapshots.forEach((snapshot: any) => {
      if (snapshot.readings && snapshot.readings.length > 0) {
        snapshot.readings.forEach((reading: any) => {
          const readingDate = new Date(reading.timestamp);

          // Update minimum date
          if (!minDate || readingDate < minDate) {
            minDate = readingDate;
          }

          // Update maximum date
          if (!maxDate || readingDate > maxDate) {
            maxDate = readingDate;
          }
        });
      }
    });
  });

  return { min: minDate, max: maxDate };
}

function processDataForExport(sensorData: any[], startDate?: Date, endDate?: Date, includeAllData = false) {
  // Prepare the export data array
  const exportData: any[] = [];

  // Process each diagnostic and its snapshots
  sensorData.forEach(({ diagnostic, snapshots }) => {
    // For each snapshot in the diagnostic
    snapshots.forEach((snapshot: any) => {
      // If snapshot has readings
      if (snapshot.readings && snapshot.readings.length > 0) {
        // Process each reading
        snapshot.readings.forEach((reading: any) => {
          // Apply time range filter if specified and not including all data
          if (!includeAllData && (startDate || endDate)) {
            const readingDate = new Date(reading.timestamp);
            if (startDate && readingDate < startDate)
              return;
            if (endDate && readingDate > endDate)
              return;
          }

          // Get friendly name for the PID
          const friendlyName = PID_FRIENDLY_NAMES[reading.pid] || reading.name || `Sensor ${reading.pid}`;

          // Get standard category for the PID
          const category = PID_CATEGORY_MAP[reading.pid] || reading.category || "Unknown";

          // Create a row for each reading with diagnostic context
          exportData.push({
            id: reading.uuid || `${snapshot.uuid}-${reading.pid}`,
            pid: reading.pid,
            name: friendlyName,
            value: reading.value,
            unit: reading.unit || "",
            category,
            timestamp: reading.timestamp,
            diagnosticId: diagnostic.uuid,
            snapshotId: snapshot.uuid,
            odometer: diagnostic.odometer,
            vehicleId: diagnostic.vehicleUUID,
            notes: diagnostic.notes,
          });
        });
      }
    });
  });

  // Sort by timestamp (newest first)
  return exportData.sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}

export function useGetDiagnosticData(params: GetDiagnosticDataParams) {
  const { vehicleId, diagnosticIds, startDate, endDate, includeAllData } = params;

  return useQuery({
    queryKey: [
      "vehicles",
      vehicleId,
      "diagnosticData",
      diagnosticIds.join(","),
      startDate?.toISOString(),
      endDate?.toISOString(),
      includeAllData,
    ],
    queryFn: () => getDiagnosticDataQuery(params),
    enabled: !!vehicleId && diagnosticIds.length > 0,
  });
}
