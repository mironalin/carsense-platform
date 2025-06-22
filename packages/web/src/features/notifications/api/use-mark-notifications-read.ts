import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/rpc";

type MarkNotificationsReadParams = {
  notificationUUIDs?: string[];
  markAllAsRead?: boolean;
};

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ notificationUUIDs, markAllAsRead }: MarkNotificationsReadParams) => {
      const response = await api.notifications["mark-read"].$patch({
        json: { notificationUUIDs, markAllAsRead },
      });

      if (!response.ok) {
        const error = await response.json() as { error?: string };
        throw new Error(error.error || "Failed to mark notifications as read");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate notifications to refresh the data
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      // Show toast for "Mark All as Read" but not for auto-marking individual notifications
      if (data.updatedCount > 0 && variables.markAllAsRead) {
        toast.success(`${data.updatedCount} notification(s) marked as read`);
      }
    },
    onError: (error: Error) => {
      toast.error("Failed to mark notifications as read", {
        description: error.message,
      });
    },
  });
}
