import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";

export type VehicleTransferHistory = {
  uuid: string;
  vehicleUUID: string;
  fromUserId: string;
  toUserId: string;
  fromUserName: string | null;
  fromUserEmail: string | null;
  toUserName: string;
  toUserEmail: string;
  transferredAt: string;
};

export type VehicleTransferHistoryResponse = {
  vehicle: {
    uuid: string;
    make: string;
    model: string;
    year: number;
    vin: string | null;
  };
  transferHistory: VehicleTransferHistory[];
  pendingRequests: {
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
  }[];
};

type UseGetVehicleTransferHistoryParams = {
  vehicleUUID: string;
};

export function useGetVehicleTransferHistory({ vehicleUUID }: UseGetVehicleTransferHistoryParams) {
  return useQuery({
    queryKey: ["vehicle-transfer-history", vehicleUUID],
    queryFn: async (): Promise<VehicleTransferHistoryResponse> => {
      const response = await api["ownership-transfers"].vehicle[":vehicleUUID"].history.$get({
        param: { vehicleUUID },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch vehicle transfer history");
      }

      return response.json();
    },
    enabled: !!vehicleUUID,
  });
}
