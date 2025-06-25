import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";

export type TransferRequest = {
  uuid: string;
  vehicleUUID: string;
  fromUserId: string;
  toUserEmail: string;
  toUserId: string | null;
  status: "pending" | "accepted" | "rejected" | "cancelled" | "expired";
  message: string | null;
  requestedAt: string;
  respondedAt: string | null;
  expiresAt: string;
};

export type TransferRequestsResponse = {
  sent: TransferRequest[];
  received: TransferRequest[];
};

export async function getTransferRequestsQuery() {
  const response = await api["ownership-transfers"].$get();

  if (!response.ok) {
    throw new Error("Failed to fetch transfer requests");
  }

  const data = await response.json();

  return data;
}

export function useGetTransferRequests({ suspense = false }: { suspense?: boolean }) {
  if (suspense) {
    return useSuspenseQuery({
      queryKey: ["transfer-requests"],
      queryFn: () => getTransferRequestsQuery(),
    });
  }
  else {
    return useQuery({
      queryKey: ["transfer-requests"],
      queryFn: () => getTransferRequestsQuery(),
    });
  }
}

export function getTransferRequestsQueryOptions() {
  return queryOptions({
    queryKey: ["transfer-requests"],
    queryFn: () => getTransferRequestsQuery(),
  });
}
