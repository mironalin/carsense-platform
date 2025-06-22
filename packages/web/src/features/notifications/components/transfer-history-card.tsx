import { motion } from "framer-motion";
import { Calendar, CheckCircle, Clock, X, XCircle } from "lucide-react";

import type { Notification, TransferRequestsData } from "@/features/notifications/types";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { listItemAnimation } from "@/features/notifications/utils/animation-variants";
import { formatDate, parseNotificationData } from "@/features/notifications/utils/notification-utils";

import { NotificationIcon } from "./notification-icon";

type TransferHistoryCardProps = {
  notification: Notification;
  transferRequestsData?: TransferRequestsData;
};

export function TransferHistoryCard({
  notification,
  transferRequestsData,
}: TransferHistoryCardProps) {
  const data = parseNotificationData(notification.data);
  let statusBadge = null;

  // For transfer request notifications, show current status
  if (notification.type === "transfer_request" && data?.transferRequestUUID && transferRequestsData) {
    const request = transferRequestsData.received.find(req => req.uuid === data.transferRequestUUID);
    if (request) {
      switch (request.status) {
        case "cancelled":
          statusBadge = (
            <Badge variant="secondary" className="text-gray-500 dark:text-gray-600">
              <X className="h-3 w-3 mr-1" />
              Cancelled
            </Badge>
          );
          break;
        case "expired":
          statusBadge = (
            <Badge variant="secondary" className="text-gray-500 dark:text-gray-600">
              <Clock className="h-3 w-3 mr-1" />
              Expired
            </Badge>
          );
          break;
        case "accepted":
          statusBadge = (
            <Badge variant="secondary" className="text-blue-500 dark:text-blue-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Accepted
            </Badge>
          );
          break;
        case "rejected":
          statusBadge = (
            <Badge variant="secondary" className="text-red-500 dark:text-red-600">
              <XCircle className="h-3 w-3 mr-1" />
              Rejected
            </Badge>
          );
          break;
      }
    }
  }

  return (
    <motion.div variants={listItemAnimation}>
      <Card>
        <CardContent>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <NotificationIcon type={notification.type} />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {statusBadge}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(notification.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
