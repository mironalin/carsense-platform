import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";

import type { MaintenanceHistoryResponse } from "../types";

export function useGetMaintenanceHistory(vehicleUUID: string) {
  return useQuery({
    queryKey: ["maintenance-history", vehicleUUID],
    queryFn: async (): Promise<MaintenanceHistoryResponse> => {
      const result = await api.maintenance[":vehicleUUID"].$get({
        param: { vehicleUUID },
      });

      if (!result.ok) {
        const error = await result.json() as { error?: string };
        throw new Error(error.error || "Failed to fetch maintenance history");
      }

      return await result.json() as MaintenanceHistoryResponse;
    },
    enabled: !!vehicleUUID, // Only run query if vehicleUUID is provided
  });
}
