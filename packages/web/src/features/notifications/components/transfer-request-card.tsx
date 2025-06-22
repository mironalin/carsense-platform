import { motion } from "framer-motion";
import { Calendar, Clock, Mail } from "lucide-react";

import type { Notification } from "@/features/notifications/types";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listItemAnimation } from "@/features/notifications/utils/animation-variants";
import { formatDate, parseNotificationData } from "@/features/notifications/utils/notification-utils";

import { TransferActions } from "./transfer-actions";

type TransferRequestCardProps = {
  notification: Notification;
  onTransferResponse: (uuid: string, response: "accept" | "reject") => void;
  isTransferRequestPending: (uuid: string) => boolean;
  isRespondingToTransfer?: boolean;
};

export function TransferRequestCard({
  notification,
  onTransferResponse,
  isTransferRequestPending,
  isRespondingToTransfer = false,
}: TransferRequestCardProps) {
  const data = parseNotificationData(notification.data);
  const isPending = data?.transferRequestUUID ? isTransferRequestPending(data.transferRequestUUID) : false;

  return (
    <motion.div variants={listItemAnimation}>
      <Card className="ring-2 ring-amber-100 bg-amber-50/30">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-amber-600" />
              <div>
                <CardTitle className="text-base">
                  {notification.title}
                </CardTitle>
                <CardDescription className="mt-1">
                  {notification.message}
                </CardDescription>
              </div>
            </div>

            <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
              <Clock className="h-3 w-3 mr-1" />
              Pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Received:
              {" "}
              {formatDate(notification.createdAt)}
            </div>
          </div>

          {isPending
            ? (
                <TransferActions
                  transferRequestUUID={data.transferRequestUUID}
                  onAccept={uuid => onTransferResponse(uuid, "accept")}
                  onReject={uuid => onTransferResponse(uuid, "reject")}
                  isLoading={isRespondingToTransfer}
                  variant="full"
                />
              )
            : (
                <div className="p-3 bg-muted rounded-md text-center">
                  <p className="text-sm text-muted-foreground">
                    This transfer request is no longer available.
                  </p>
                </div>
              )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
