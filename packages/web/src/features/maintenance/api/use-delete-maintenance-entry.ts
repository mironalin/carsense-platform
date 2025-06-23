import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/rpc";

export function useDeleteMaintenanceEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (maintenanceUUID: string) => {
      const response = await api.maintenance[":maintenanceUUID"].$delete({
        param: { maintenanceUUID },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error((errorData as any).error || "Failed to delete maintenance entry");
      }

      return await response.json();
    },
    onSuccess: () => {
      // Invalidate maintenance history queries to refresh the data
      queryClient.invalidateQueries({
        queryKey: ["maintenance-history"],
      });

      toast.success("Maintenance entry deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete maintenance entry");
    },
  });
}
