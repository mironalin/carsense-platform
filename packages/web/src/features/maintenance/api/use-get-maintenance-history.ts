import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";

import type { MaintenanceHistoryResponse } from "../types";

export async function getMaintenanceHistoryQuery({ vehicleUUID }: { vehicleUUID: string }) {
  const result = await api.maintenance[":vehicleUUID"].$get({
    param: { vehicleUUID },
  });

  if (!result.ok) {
    const error = await result.json() as { error?: string };
    throw new Error(error.error || "Failed to fetch maintenance history");
  }

  return await result.json() as MaintenanceHistoryResponse;
}

export function useGetMaintenanceHistory({ vehicleUUID, suspense = false }: { vehicleUUID: string; suspense?: boolean }) {
  if (suspense) {
    return useSuspenseQuery({
      queryKey: ["maintenance-history", vehicleUUID],
      queryFn: () => getMaintenanceHistoryQuery({ vehicleUUID }),
    });
  }
  else {
    return useQuery({
      queryKey: ["maintenance-history", vehicleUUID],
      queryFn: () => getMaintenanceHistoryQuery({ vehicleUUID }),
    });
  }
}

export function getMaintenanceHistoryQueryOptions({ vehicleUUID }: { vehicleUUID: string }) {
  return queryOptions({
    queryKey: ["maintenance-history", vehicleUUID],
    queryFn: () => getMaintenanceHistoryQuery({ vehicleUUID }),
  });
}
