import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";

import type { DashboardOverview } from "../types";

type UseGetDashboardOverviewProps = {
  vehicleUUID: string;
};

export function useGetDashboardOverview({ vehicleUUID }: UseGetDashboardOverviewProps) {
  return useQuery({
    queryKey: ["dashboard", "overview", vehicleUUID],
    queryFn: async (): Promise<DashboardOverview> => {
      const response = await api.dashboard[":vehicleUUID"].overview.$get({
        param: { vehicleUUID },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard overview");
      }

      return await response.json();
    },
    enabled: !!vehicleUUID,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function getDashboardOverviewQueryOptions({ vehicleUUID }: UseGetDashboardOverviewProps) {
  return {
    queryKey: ["dashboard", "overview", vehicleUUID],
    queryFn: async (): Promise<DashboardOverview> => {
      const response = await api.dashboard[":vehicleUUID"].overview.$get({
        param: { vehicleUUID },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard overview");
      }

      return await response.json();
    },
    enabled: !!vehicleUUID,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  };
}
