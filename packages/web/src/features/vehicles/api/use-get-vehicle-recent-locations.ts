import { queryOptions, useQuery } from "@tanstack/react-query";

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

export function useGetVehicleRecentLocations(vehicleId: string, limit: number = 10) {
  const query = useQuery({
    queryKey: ["vehicles", vehicleId, "locations", "recent", limit],
    queryFn: () => getVehicleRecentLocationsQuery(vehicleId, limit),
    enabled: !!vehicleId,
  });

  return query;
}

export function getVehicleRecentLocationsQueryOptions(vehicleId: string, limit: number = 10) {
  return queryOptions({
    queryKey: ["vehicles", vehicleId, "locations", "recent", limit],
    queryFn: () => getVehicleRecentLocationsQuery(vehicleId, limit),
  });
}
