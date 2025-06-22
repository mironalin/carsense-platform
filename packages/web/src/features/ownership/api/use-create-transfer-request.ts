import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/rpc";

export type CreateTransferRequestData = {
  vehicleUUID: string;
  toUserEmail: string;
  message?: string;
};

export function useCreateTransferRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTransferRequestData) => {
      const response = await api["ownership-transfers"].request.$post({
        json: data,
      });

      if (!response.ok) {
        const error = await response.json() as { error?: string };
        throw new Error(error.error || "Failed to create transfer request");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate and refetch transfer requests
      queryClient.invalidateQueries({ queryKey: ["transfer-requests"] });

      // Invalidate vehicle transfer history for all vehicles
      queryClient.invalidateQueries({ queryKey: ["vehicle-transfer-history"] });

      toast.success("Transfer request sent successfully!", {
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to create transfer request", {
        description: error.message,
      });
    },
  });
}
