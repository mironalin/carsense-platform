import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";

export async function getVehiclesQuery() {
  const response = await api.vehicles.$get();

  if (!response.ok) {
    throw new Error(`Failed to fetch vehicles: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
}

export function useGetVehicles() {
  const query = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehiclesQuery,
  });

  return query;
}

export const getVehiclesQueryOptions = queryOptions({
  queryKey: ["vehicles"],
  queryFn: getVehiclesQuery,
});
