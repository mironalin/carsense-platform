import { useQuery } from "@tanstack/react-query";

import type { DiagnosticWithParsedDates } from "@/features/vehicles/types";

import { api } from "@/lib/rpc";

export async function getVehicleDiagnosticsQuery(vehicleId: string) {
  const response = await api.vehicles[":vehicleUUID"].diagnostics.$get({
    param: { vehicleUUID: vehicleId },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch vehicle diagnostics: ${response.statusText}`);
  }

  const data = await response.json();

  // Parse the dates to ISO strings for easier handling
  const diagnostics: DiagnosticWithParsedDates[] = data.map((diag: any) => ({
    ...diag,
    createdAt: new Date(diag.createdAt).toISOString(),
    updatedAt: new Date(diag.updatedAt).toISOString(),
  }));

  return diagnostics;
}

export function useGetVehicleDiagnostics(vehicleId: string) {
  return useQuery({
    queryKey: ["vehicles", vehicleId, "diagnostics"],
    queryFn: () => getVehicleDiagnosticsQuery(vehicleId),
    enabled: Boolean(vehicleId),
  });
}

export function getVehicleDiagnosticsQueryOptions(vehicleId: string) {
  return {
    queryKey: ["vehicles", vehicleId, "diagnostics"],
    queryFn: () => getVehicleDiagnosticsQuery(vehicleId),
    enabled: Boolean(vehicleId),
  };
}
