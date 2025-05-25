import { api } from "@/lib/rpc"
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getVehiclesQuery = async () =>{
  const response = await api.vehicles.$get();

  if (!response.ok) {
    throw Error("Failed to fetch vehicles: " + response.statusText);
  }

  const data = await response.json();

  return data;
}

export const useGetVehicles = () => {
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