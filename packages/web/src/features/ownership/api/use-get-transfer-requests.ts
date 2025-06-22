import { useQuery } from "@tanstack/react-query";

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

export function useGetTransferRequests() {
  return useQuery({
    queryKey: ["transfer-requests"],
    queryFn: async (): Promise<TransferRequestsResponse> => {
      const response = await api["ownership-transfers"].$get();

      if (!response.ok) {
        throw new Error("Failed to fetch transfer requests");
      }

      return response.json();
    },
  });
}
