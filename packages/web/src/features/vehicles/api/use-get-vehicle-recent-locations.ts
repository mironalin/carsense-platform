import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";

export async function getVehicleRecentLocationsQuery(vehicleId: string, limit: number = 10) {
  const response = await api.vehicles[":vehicleUUID"].locations.recent.$get({
    param: { vehicleUUID: vehicleId },
    query: { limit: limit.toString() },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch vehicle locations: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
}

export function useGetVehicleRecentLocations({ vehicleId, limit = 10, suspense = false }: { vehicleId: string; limit?: number; suspense?: boolean }) {
  if (suspense) {
    return useSuspenseQuery({
      queryKey: ["vehicles", vehicleId, "locations", "recent", limit],
      queryFn: () => getVehicleRecentLocationsQuery(vehicleId, limit),
    });
  }
  else {
    return useQuery({
      queryKey: ["vehicles", vehicleId, "locations", "recent", limit],
      queryFn: () => getVehicleRecentLocationsQuery(vehicleId, limit),
    });
  }
}

export function getVehicleRecentLocationsQueryOptions({ vehicleId, limit = 10 }: { vehicleId: string; limit?: number }) {
  return queryOptions({
    queryKey: ["vehicles", vehicleId, "locations", "recent", limit],
    queryFn: () => getVehicleRecentLocationsQuery(vehicleId, limit),
  });
}
