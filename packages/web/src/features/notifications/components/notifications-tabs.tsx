import { motion } from "framer-motion";
import { Bell, Clock, Mail } from "lucide-react";

import type { Notification, TransferRequestsData } from "@/features/notifications/types";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fadeAnimation, listAnimation } from "@/features/notifications/utils/animation-variants";

import { EmptyState } from "./empty-state";
import { NotificationCard } from "./notification-card";
import { TransferHistoryCard } from "./transfer-history-card";
import { TransferRequestCard } from "./transfer-request-card";

type NotificationsTabsProps = {
  activeTab: string;
  onTabChange: (value: string) => void;
  allCount: number;
  transferRequestsCount: number;
  transferHistoryCount: number;
  // Content props
  allNotifications: Notification[];
  transferRequests: Notification[];
  transferHistory: Notification[];
  transferRequestsData?: TransferRequestsData;
  onMarkAsRead: (uuid: string, isCurrentlyRead: boolean) => void;
  onDelete: (uuid: string) => void;
  onTransferResponse: (uuid: string, response: "accept" | "reject") => void;
  isTransferRequestPending: (uuid: string) => boolean;
  isMarkingAsRead?: boolean;
  isDeletingNotification?: boolean;
  isRespondingToTransfer?: boolean;
};

export function NotificationsTabs({
  activeTab,
  onTabChange,
  allCount,
  transferRequestsCount,
  transferHistoryCount,
  // Content props
  allNotifications,
  transferRequests,
  transferHistory,
  transferRequestsData,
  onMarkAsRead,
  onDelete,
  onTransferResponse,
  isTransferRequestPending,
  isMarkingAsRead = false,
  isDeletingNotification = false,
  isRespondingToTransfer = false,
}: NotificationsTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          All Notifications
          {allCount > 0 && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {allCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="transfers" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Transfer Requests
          {transferRequestsCount > 0 && (
            <Badge variant="secondary" className="ml-1 text-xs text-amber-500 dark:text-amber-600">
              {transferRequestsCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Transfer History
          {transferHistoryCount > 0 && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {transferHistoryCount}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      {/* All Notifications Tab */}
      <TabsContent value="all">
        <motion.div
          variants={listAnimation}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {allNotifications.length === 0
            ? (
                <EmptyState
                  icon={Bell}
                  title="No notifications"
                  description="You're all caught up! New notifications will appear here."
                />
              )
            : (
                allNotifications.map(notification => (
                  <NotificationCard
                    key={notification.uuid}
                    notification={notification}
                    transferRequestsData={transferRequestsData}
                    onMarkAsRead={onMarkAsRead}
                    onDelete={onDelete}
                    onTransferResponse={onTransferResponse}
                    isTransferRequestPending={isTransferRequestPending}
                    isMarkingAsRead={isMarkingAsRead}
                    isDeletingNotification={isDeletingNotification}
                    isRespondingToTransfer={isRespondingToTransfer}
                  />
                ))
              )}
        </motion.div>
      </TabsContent>

      {/* Transfer Requests Tab */}
      <TabsContent value="transfers">
        <motion.div
          variants={listAnimation}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {transferRequests.length === 0
            ? (
                <EmptyState
                  icon={Mail}
                  title="No pending transfer requests"
                  description="You don't have any pending vehicle transfer requests at the moment."
                />
              )
            : (
                <>
                  <motion.div variants={fadeAnimation}>
                    <Alert>
                      <Mail className="h-4 w-4" />
                      <AlertTitle>Action Required</AlertTitle>
                      <AlertDescription>
                        You have
                        {" "}
                        {transferRequests.length}
                        {" "}
                        pending transfer request
                        {transferRequests.length !== 1 ? "s" : ""}
                        .
                        Please review and respond to accept or reject the vehicle transfer
                        {transferRequests.length !== 1 ? "s" : ""}
                        .
                      </AlertDescription>
                    </Alert>
                  </motion.div>

                  {transferRequests.map(notification => (
                    <TransferRequestCard
                      key={notification.uuid}
                      notification={notification}
                      onTransferResponse={onTransferResponse}
                      isTransferRequestPending={isTransferRequestPending}
                      isRespondingToTransfer={isRespondingToTransfer}
                    />
                  ))}
                </>
              )}
        </motion.div>
      </TabsContent>

      {/* Transfer History Tab */}
      <TabsContent value="history">
        <motion.div
          variants={listAnimation}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {transferHistory.length === 0
            ? (
                <EmptyState
                  icon={Clock}
                  title="No transfer history"
                  description="Your transfer history will appear here once you've completed vehicle transfers."
                />
              )
            : (
                transferHistory.map(notification => (
                  <TransferHistoryCard
                    key={notification.uuid}
                    notification={notification}
                    transferRequestsData={transferRequestsData}
                  />
                ))
              )}
        </motion.div>
      </TabsContent>
    </Tabs>
  );
}
