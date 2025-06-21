import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";

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

export function useGetVehicleById({ vehicleId, suspense = false }: { vehicleId: string; suspense?: boolean }) {
  if (suspense) {
    return useSuspenseQuery({
      queryKey: ["vehicles", vehicleId],
      queryFn: () => getVehicleByIdQuery(vehicleId),
    });
  }
  else {
    return useQuery({
      queryKey: ["vehicles", vehicleId],
      queryFn: () => getVehicleByIdQuery(vehicleId),
    });
  }
}

export function getVehicleByIdQueryOptions({ vehicleId }: { vehicleId: string }) {
  return queryOptions({
    queryKey: ["vehicles", vehicleId],
    queryFn: () => getVehicleByIdQuery(vehicleId),
  });
}
