import { queryOptions, useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";

import { api } from "@/lib/rpc";

import type { DiagnosticItem } from "../types";

export async function getDiagnosticsQuery(vehicleId: string) {
  // First, fetch the vehicle details to get make, model, and license plate
  const vehicleResponse = await api.vehicles[":vehicleUUID"].$get({
    param: { vehicleUUID: vehicleId },
  });

  if (!vehicleResponse.ok) {
    throw new Error(`Failed to fetch vehicle: ${vehicleResponse.statusText}`);
  }

  const vehicleData = await vehicleResponse.json();
  const vehicleLabel = `${vehicleData.make} ${vehicleData.model} - ${vehicleData.licensePlate}`;

  // Then fetch diagnostic data
  const diagnosticsResponse = await api.vehicles[":vehicleUUID"].diagnostics.$get({
    param: { vehicleUUID: vehicleId },
  });

  if (!diagnosticsResponse.ok) {
    throw new Error(`Failed to fetch vehicle diagnostics: ${diagnosticsResponse.statusText}`);
  }

  const data = await diagnosticsResponse.json();

  // Map the API response to our DiagnosticItem format
  const diagnostics: DiagnosticItem[] = data.map((diag: any) => {
    // Format the date if available - handle ISO string parsing safely
    let diagDate = "Unknown date";

    // Use createdAt for the date
    if (diag.createdAt) {
      try {
        // Use parseISO for reliable ISO string parsing
        const date = parseISO(diag.createdAt);
        diagDate = format(date, "MMM d, yyyy");
      }
      catch (error) {
        console.error("Error parsing date:", error, "from value:", diag.createdAt);
      }
    }

    // Format the odometer reading
    const odometerFormatted = diag.odometer
      ? `${new Intl.NumberFormat().format(diag.odometer)} ${diag.odometerUnit || "km"}`
      : "Unknown mileage";

    return {
      id: diag.uuid,
      name: diag.notes || `Diagnostic ${diag.uuid.substring(0, 8)}`,
      category: vehicleLabel, // Use the vehicle details instead of UUID
      date: diagDate,
      odometer: odometerFormatted,
      pid: diag.pid || "",
      timestamp: diag.createdAt, // Use createdAt as the timestamp
      vehicleId: diag.vehicleUUID,
    };
  });

  return diagnostics;
}

export function useGetDiagnostics(vehicleId: string) {
  const query = useQuery({
    queryKey: ["vehicles", vehicleId, "diagnostics", "export"],
    queryFn: () => getDiagnosticsQuery(vehicleId),
    enabled: !!vehicleId,
  });

  return query;
}

export function getDiagnosticsQueryOptions(vehicleId: string) {
  return queryOptions({
    queryKey: ["vehicles", vehicleId, "diagnostics", "export"],
    queryFn: () => getDiagnosticsQuery(vehicleId),
  });
}
