import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";

export async function getVehicleByIdQuery(vehicleId: string) {
  const response = await api.vehicles[":vehicleUUID"].$get({
    param: { vehicleUUID: vehicleId },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch vehicle: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
}

export function useGetVehicleById(vehicleId: string) {
  const query = useQuery({
    queryKey: ["vehicles", vehicleId],
    queryFn: () => getVehicleByIdQuery(vehicleId),
    enabled: !!vehicleId,
  });

  return query;
}

export function getVehicleByIdQueryOptions(vehicleId: string) {
  return queryOptions({
    queryKey: ["vehicles", vehicleId],
    queryFn: () => getVehicleByIdQuery(vehicleId),
  });
}
