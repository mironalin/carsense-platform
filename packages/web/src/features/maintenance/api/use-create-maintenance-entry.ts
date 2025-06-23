import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/rpc";

import type { CreateMaintenanceEntry, MaintenanceEntryResponse } from "../types";

export function useCreateMaintenanceEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMaintenanceEntry): Promise<MaintenanceEntryResponse> => {
      const result = await api.maintenance.$post({
        json: data,
      });

      if (!result.ok) {
        const error = await result.json() as { error?: string };
        throw new Error(error.error || "Failed to create maintenance entry");
      }

      return await result.json() as MaintenanceEntryResponse;
    },
    onSuccess: (data) => {
      // Invalidate and refetch maintenance history for the vehicle
      queryClient.invalidateQueries({
        queryKey: ["maintenance-history", data.maintenanceEntry.vehicleUUID],
      });

      // Optionally invalidate vehicle data if it includes maintenance info
      queryClient.invalidateQueries({
        queryKey: ["vehicle", data.maintenanceEntry.vehicleUUID],
      });

      toast.success("Maintenance entry created successfully!", {
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to create maintenance entry", {
        description: error.message,
      });
    },
  });
}
