import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { TransferRequest } from "@/features/ownership/api/use-get-transfer-requests";

import { ErrorPage } from "@/components/error-page";
import { LoaderPage } from "@/components/loader-page";
import { NotFoundPage } from "@/components/not-found-page";
import { useDeleteNotification } from "@/features/notifications/api/use-delete-notification";
import { useGetNotifications } from "@/features/notifications/api/use-get-notifications";
import { useMarkNotificationsRead } from "@/features/notifications/api/use-mark-notifications-read";
import { NotificationsHeader } from "@/features/notifications/components/notifications-header";
import { NotificationsTabs } from "@/features/notifications/components/notifications-tabs";
import { pageVariants } from "@/features/notifications/utils/animation-variants";
import { parseNotificationData } from "@/features/notifications/utils/notification-utils";
import { useGetTransferRequests } from "@/features/ownership/api/use-get-transfer-requests";
import { useRespondToTransfer } from "@/features/ownership/api/use-respond-to-transfer";

export const Route = createFileRoute("/_authenticated/app/notifications/")({
  component: RouteComponent,
  pendingComponent: () => <LoaderPage />,
  notFoundComponent: () => <NotFoundPage />,
  errorComponent: () => <ErrorPage />,
});

function RouteComponent() {
  const [activeTab, setActiveTab] = useState("all");

  const { data: notifications, isLoading } = useGetNotifications();
  const { data: transferRequestsData } = useGetTransferRequests({ suspense: true });
  const respondToTransferMutation = useRespondToTransfer();
  const markNotificationsReadMutation = useMarkNotificationsRead();
  const deleteNotificationMutation = useDeleteNotification();

  const handleRespondToTransfer = async (requestUuid: string, response: "accept" | "reject") => {
    try {
      await respondToTransferMutation.mutateAsync({
        requestUUID: requestUuid,
        action: response,
      });

      toast.success(
        response === "accept"
          ? "Transfer request accepted!"
          : "Transfer request rejected",
      );
    }
    catch {
      // Error handled by the mutation
    }
  };

  const handleMarkAsRead = async (notificationUUID: string, isCurrentlyRead: boolean) => {
    if (isCurrentlyRead) {
      // Mark as unread - we'd need a separate API endpoint for this
      toast.info("Mark as unread functionality not implemented yet");
      return;
    }

    try {
      await markNotificationsReadMutation.mutateAsync({
        notificationUUIDs: [notificationUUID],
      });
    }
    catch {
      // Error handled by the mutation
    }
  };

  const handleDeleteNotification = async (notificationUUID: string) => {
    try {
      await deleteNotificationMutation.mutateAsync({
        notificationUUID,
      });
    }
    catch {
      // Error handled by the mutation
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markNotificationsReadMutation.mutateAsync({
        markAllAsRead: true,
      });
    }
    catch {
      // Error handled by the mutation
    }
  };

  const isTransferRequestPending = (transferRequestUUID: string) => {
    if (!transferRequestsData)
      return false;
    const request = transferRequestsData.received.find((req: TransferRequest) => req.uuid === transferRequestUUID);
    return request?.status === "pending" && new Date(request.expiresAt) > new Date();
  };

  const allNotifications = notifications?.notifications || [];
  const transferRequests = allNotifications.filter((n) => {
    if (n.type !== "transfer_request")
      return false;
    const data = parseNotificationData(n.data);
    return data?.transferRequestUUID ? isTransferRequestPending(data.transferRequestUUID) : false;
  });
  const transferHistory = allNotifications.filter((n) => {
    // Include completed transfer notifications
    if (["transfer_accepted", "transfer_rejected", "transfer_cancelled"].includes(n.type)) {
      return true;
    }
    // Include transfer request notifications that are no longer pending
    if (n.type === "transfer_request") {
      const data = parseNotificationData(n.data);
      return data?.transferRequestUUID ? !isTransferRequestPending(data.transferRequestUUID) : true;
    }
    return false;
  });
  const unreadCount = notifications?.unreadCount || 0;

  // Auto-mark notifications as read when page is viewed (after 2 seconds)
  useEffect(() => {
    if (!notifications?.notifications || unreadCount === 0)
      return;

    const timer = setTimeout(() => {
      const unreadNotifications = notifications.notifications
        .filter(n => n.isRead === "false")
        .map(n => n.uuid);

      if (unreadNotifications.length > 0) {
        markNotificationsReadMutation.mutate({
          notificationUUIDs: unreadNotifications,
        });
      }
    }, 2000); // Wait 2 seconds before auto-marking as read

    return () => clearTimeout(timer);
  }, [notifications, unreadCount, markNotificationsReadMutation]);

  if (isLoading) {
    return <LoaderPage />;
  }

  return (
    <motion.div
      className="container mx-auto p-4 lg:p-6 space-y-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <NotificationsHeader
        unreadCount={unreadCount}
        onMarkAllAsRead={handleMarkAllAsRead}
        isMarkingAsRead={markNotificationsReadMutation.isPending}
      />

      <NotificationsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        allCount={allNotifications.length}
        transferRequestsCount={transferRequests.length}
        transferHistoryCount={transferHistory.length}
        allNotifications={allNotifications}
        transferRequests={transferRequests}
        transferHistory={transferHistory}
        transferRequestsData={transferRequestsData}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDeleteNotification}
        onTransferResponse={handleRespondToTransfer}
        isTransferRequestPending={isTransferRequestPending}
        isMarkingAsRead={markNotificationsReadMutation.isPending}
        isDeletingNotification={deleteNotificationMutation.isPending}
        isRespondingToTransfer={respondToTransferMutation.isPending}
      />
    </motion.div>
  );
}
