import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/rpc";

type CancelTransferRequestParams = {
  requestUUID: string;
};

export function useCancelTransferRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestUUID }: CancelTransferRequestParams) => {
      const response = await api["ownership-transfers"][":requestUUID"].cancel.$patch({
        param: { requestUUID },
      });

      if (!response.ok) {
        const error = await response.json() as { error?: string };
        throw new Error(error.error || "Failed to cancel transfer request");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate transfer requests to refresh the data
      queryClient.invalidateQueries({ queryKey: ["transfer-requests"] });

      // Invalidate vehicle transfer history for all vehicles
      queryClient.invalidateQueries({ queryKey: ["vehicle-transfer-history"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to cancel transfer request");
    },
  });
}
