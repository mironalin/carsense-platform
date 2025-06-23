import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";

import type { DiagnosticDTC } from "../types";

/**
 * Fetches DTCs for a specific diagnostic
 */
export async function getDiagnosticDTCsQuery(diagnosticId: string) {
  const response = await api.diagnostics[":diagnosticUUID"].dtcs.$get({
    param: { diagnosticUUID: diagnosticId },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch diagnostic DTCs: ${response.statusText}`);
  }

  const data = await response.json();

  // Parse the dates to ISO strings for easier handling
  const dtcs: DiagnosticDTC[] = data.map((dtc: any) => ({
    ...dtc,
    createdAt: new Date(dtc.createdAt).toISOString(),
    updatedAt: new Date(dtc.updatedAt).toISOString(),
  }));

  return dtcs;
}

export function useGetDiagnosticDTCs({ diagnosticId, suspense = false }: { diagnosticId: string | undefined; suspense?: boolean }) {
  if (suspense) {
    return useSuspenseQuery({
      queryKey: ["diagnostics", diagnosticId, "dtcs"],
      queryFn: () => getDiagnosticDTCsQuery(diagnosticId!),
    });
  }
  else {
    return useQuery({
      queryKey: ["diagnostics", diagnosticId, "dtcs"],
      queryFn: () => getDiagnosticDTCsQuery(diagnosticId!),
      enabled: Boolean(diagnosticId),
    });
  }
}

export function getDiagnosticDTCsQueryOptions({ diagnosticId }: { diagnosticId: string }) {
  return queryOptions({
    queryKey: ["diagnostics", diagnosticId, "dtcs"],
    queryFn: () => getDiagnosticDTCsQuery(diagnosticId),
  });
}
