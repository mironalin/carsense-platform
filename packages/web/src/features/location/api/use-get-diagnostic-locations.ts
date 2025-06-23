import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";

export async function getDiagnosticLocationsQuery({ diagnosticUUID }: { diagnosticUUID: string }) {
  const response = await api.locations[":diagnosticUUID"].locations.$get({
    param: { diagnosticUUID },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch diagnostic locations: ${response.status}`);
  }

  return response.json();
}

export function useGetDiagnosticLocations({ diagnosticUUID, suspense = false }: { diagnosticUUID: string; suspense?: boolean }) {
  if (suspense) {
    return useSuspenseQuery({
      queryKey: ["diagnostic-locations", diagnosticUUID],
      queryFn: () => getDiagnosticLocationsQuery({ diagnosticUUID }),
    });
  }
  else {
    return useQuery({
    queryKey: ["diagnostic-locations", diagnosticUUID],
    queryFn: () => getDiagnosticLocationsQuery({ diagnosticUUID }),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  }
}

export function getDiagnosticLocationsQueryOptions({ diagnosticUUID }: { diagnosticUUID: string }) {
  return queryOptions({
    queryKey: ["diagnostic-locations", diagnosticUUID],
    queryFn: () => getDiagnosticLocationsQuery({ diagnosticUUID }),
  });
}