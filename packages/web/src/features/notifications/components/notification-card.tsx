import { motion } from "framer-motion";
import { Calendar, MoreHorizontal, Trash2 } from "lucide-react";

import type { Notification, TransferRequestsData } from "@/features/notifications/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { notificationCardAnimation } from "@/features/notifications/utils/animation-variants";
import { formatDate, parseNotificationData } from "@/features/notifications/utils/notification-utils";

import { NotificationBadge } from "./notification-badge";
import { NotificationIcon } from "./notification-icon";
import { TransferActions } from "./transfer-actions";

type NotificationCardProps = {
  notification: Notification;
  transferRequestsData?: TransferRequestsData;
  onMarkAsRead: (uuid: string, isCurrentlyRead: boolean) => void;
  onDelete: (uuid: string) => void;
  onTransferResponse: (uuid: string, response: "accept" | "reject") => void;
  isTransferRequestPending: (uuid: string) => boolean;
  isMarkingAsRead?: boolean;
  isDeletingNotification?: boolean;
  isRespondingToTransfer?: boolean;
};

export function NotificationCard({
  notification,
  transferRequestsData: _transferRequestsData,
  onMarkAsRead,
  onDelete,
  onTransferResponse,
  isTransferRequestPending,
  isMarkingAsRead = false,
  isDeletingNotification = false,
  isRespondingToTransfer = false,
}: NotificationCardProps) {
  const data = parseNotificationData(notification.data);
  const isPending = data?.transferRequestUUID ? isTransferRequestPending(data.transferRequestUUID) : false;

  return (
    <motion.div variants={notificationCardAnimation}>
      <Card className={notification.isRead === "false" ? "ring-1 ring-blue-500 dark:ring-blue-600" : ""}>
        <CardContent>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <NotificationIcon type={notification.type} />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium leading-tight">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <NotificationBadge isRead={notification.isRead} />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onMarkAsRead(notification.uuid, notification.isRead === "true")}
                        disabled={isMarkingAsRead}
                      >
                        Mark as
                        {" "}
                        {notification.isRead === "true" ? "unread" : "read"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(notification.uuid)}
                        disabled={isDeletingNotification}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(notification.createdAt)}
                </div>
              </div>

              {/* Action buttons for transfer requests */}
              {notification.type === "transfer_request" && (
                <>
                  {isPending
                    ? (
                        <>
                          <Separator className="my-3" />
                          <TransferActions
                            transferRequestUUID={data.transferRequestUUID}
                            onAccept={uuid => onTransferResponse(uuid, "accept")}
                            onReject={uuid => onTransferResponse(uuid, "reject")}
                            isLoading={isRespondingToTransfer}
                            variant="inline"
                          />
                        </>
                      )
                    : (
                        <div className="mt-3 p-2 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground">
                            This transfer request is no longer available.
                          </p>
                        </div>
                      )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
