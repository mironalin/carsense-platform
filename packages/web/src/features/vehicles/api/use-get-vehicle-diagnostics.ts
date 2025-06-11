import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";

export async function getVehicleDiagnosticsQuery(vehicleId: string) {
  const response = await api.vehicles[":vehicleUUID"].diagnostics.$get({
    param: { vehicleUUID: vehicleId },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch vehicle diagnostics: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
}

export function useGetVehicleDiagnostics(vehicleId: string) {
  const query = useQuery({
    queryKey: ["vehicles", vehicleId, "diagnostics"],
    queryFn: () => getVehicleDiagnosticsQuery(vehicleId),
    enabled: !!vehicleId,
  });

  return query;
}

export function getVehicleDiagnosticsQueryOptions(vehicleId: string) {
  return queryOptions({
    queryKey: ["vehicles", vehicleId, "diagnostics"],
    queryFn: () => getVehicleDiagnosticsQuery(vehicleId),
  });
}
