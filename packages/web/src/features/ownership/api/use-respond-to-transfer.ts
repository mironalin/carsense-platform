import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/rpc";

export type RespondToTransferData = {
  requestUUID: string;
  action: "accept" | "reject";
};

export function useRespondToTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestUUID, action }: RespondToTransferData) => {
      const response = await api["ownership-transfers"][":requestUUID"].respond.$patch({
        param: { requestUUID },
        json: { action },
      });

      if (!response.ok) {
        const error = await response.json() as { error?: string };
        throw new Error(error.error || "Failed to respond to transfer request");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch transfer requests
      queryClient.invalidateQueries({ queryKey: ["transfer-requests"] });

      // Also invalidate vehicles list since ownership may have changed
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });

      // Invalidate vehicle transfer history for all vehicles
      queryClient.invalidateQueries({ queryKey: ["vehicle-transfer-history"] });

      const actionText = variables.action === "accept" ? "accepted" : "rejected";
      toast.success(`Transfer request ${actionText}`, {
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to respond to transfer request", {
        description: error.message,
      });
    },
  });
}
