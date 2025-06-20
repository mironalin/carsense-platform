import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";

// This type represents the data returned from the DTC library API
export type DTCLibraryInfo = {
  uuid: string;
  code: string;
  description: string;
  severity: "low" | "medium" | "high";
  affectedSystem: string | null;
  category: string | null;
  createdAt: string;
  updatedAt: string;
};

/**
 * Fetches DTC information by code
 */
export async function getDTCByCodeQuery(code: string) {
  if (!code)
    return null;

  try {
    // The API endpoint is /api/dtc?code={code}
    const response = await api.dtc.$get({
      query: { code },
    });

    if (!response.ok) {
      console.error(`Error fetching DTC info for code ${code}: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error(`Error fetching DTC info for code ${code}:`, error);
    return null;
  }
}

/**
 * Hook to fetch diagnostic trouble code information by code
 */
export function useGetDTCByCode(code: string) {
  return useQuery({
    queryKey: ["dtc", code],
    queryFn: () => getDTCByCodeQuery(code),
    enabled: !!code,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
