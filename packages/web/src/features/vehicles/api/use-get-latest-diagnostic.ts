import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";

export async function getLatestDiagnosticQuery(vehicleId: string) {
  const response = await api.vehicles[":vehicleUUID"].diagnostics.$get({
    param: { vehicleUUID: vehicleId },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sensor data: ${response.statusText}`);
  }

  const data = await response.json();

  return data.length > 0
    ? data.sort((a, b) =>
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime(),
    )[0]
    : null;
}

export function useGetLatestDiagnostic(vehicleId: string) {
  const query = useQuery({
    queryKey: ["vehicles", vehicleId, "sensors", "latest"],
    queryFn: () => getLatestDiagnosticQuery(vehicleId),
    enabled: !!vehicleId,
  });

  return query;
}

export function getLatestDiagnosticQueryOptions(vehicleId: string) {
  return queryOptions({
    queryKey: ["vehicles", vehicleId, "sensors", "latest"],
    queryFn: () => getLatestDiagnosticQuery(vehicleId),
  });
}
