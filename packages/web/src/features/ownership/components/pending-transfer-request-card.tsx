import { motion } from "framer-motion";
import { Clock, Mail, X } from "lucide-react";

import type { TransferRequest } from "@/features/ownership/types";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buttonAnimation } from "@/features/ownership/utils/animation-variants";
import { formatDate, isExpired } from "@/features/ownership/utils/ownership-utils";

import { TransferStatusBadge } from "./transfer-status-badge";

type PendingTransferRequestCardProps = {
  pendingRequest: TransferRequest;
  onCancel: (requestUuid: string) => void;
  isLoading?: boolean;
};

export function PendingTransferRequestCard({
  pendingRequest,
  onCancel,
  isLoading = false,
}: PendingTransferRequestCardProps) {
  return (
    <div className="space-y-4">
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertTitle>Transfer Request Pending</AlertTitle>
        <AlertDescription>
          You already have a pending transfer request for this vehicle.
          Cancel the existing request to send a new one.
        </AlertDescription>
      </Alert>

      <Card className="ring-1 ring-amber-500 dark:ring-amber-600">
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">
                    To:
                    {" "}
                    {pendingRequest.toUserEmail}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(pendingRequest.requestedAt)}
                  </p>
                </div>
              </div>
              <TransferStatusBadge status={pendingRequest.status} />
            </div>

            {pendingRequest.message && (
              <div className="p-2 bg-muted rounded text-sm">
                <span className="font-medium">Message:</span>
                {" "}
                "
                {pendingRequest.message}
                "
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {isExpired(pendingRequest.expiresAt) ? "Expired" : "Expires"}
                :
                {formatDate(pendingRequest.expiresAt)}
              </div>
            </div>

            <motion.div variants={buttonAnimation} whileHover="hover" whileTap="tap">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onCancel(pendingRequest.uuid)}
                disabled={isLoading}
                className="w-full"
              >
                <X className="h-4 w-4" />
                Cancel Request
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
