import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";

export type Notification = {
  uuid: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data: string | null;
  isRead: string;
  createdAt: string;
};

export type NotificationsResponse = {
  notifications: Notification[];
  unreadCount: number;
};

export function useGetNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async (): Promise<NotificationsResponse> => {
      const response = await api.notifications.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      return response.json();
    },
  });
}

export function useGetUnreadCount() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async (): Promise<{ unreadCount: number }> => {
      const response = await api.notifications["unread-count"].$get();

      if (!response.ok) {
        throw new Error("Failed to fetch unread count");
      }

      return response.json();
    },
    // Refetch every 30 seconds to keep count updated
    refetchInterval: 30000,
  });
}
