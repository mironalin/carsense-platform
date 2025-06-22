import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/rpc";

type DeleteNotificationParams = {
  notificationUUID: string;
};

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ notificationUUID }: DeleteNotificationParams) => {
      const response = await api.notifications[":notificationUUID"].$delete({
        param: { notificationUUID },
      });

      if (!response.ok) {
        const error = await response.json() as { error?: string };
        throw new Error(error.error || "Failed to delete notification");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate notifications to refresh the data
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification deleted");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete notification", {
        description: error.message,
      });
    },
  });
}
