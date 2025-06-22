import { motion } from "framer-motion";
import { Send } from "lucide-react";

import type { TransferRequest } from "@/features/ownership/types";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cardAnimation } from "@/features/ownership/utils/animation-variants";

import { PendingTransferRequestCard } from "./pending-transfer-request-card";
import { TransferRequestForm } from "./transfer-request-form";

type TransferRequestSectionProps = {
  vehicleId: string;
  hasActiveRequest: boolean;
  pendingRequest?: TransferRequest;
  onCancelRequest: (requestUuid: string) => void;
  isCancelLoading?: boolean;
};

export function TransferRequestSection({
  vehicleId,
  hasActiveRequest,
  pendingRequest,
  onCancelRequest,
  isCancelLoading = false,
}: TransferRequestSectionProps) {
  return (
    <motion.div variants={cardAnimation} initial="hidden" animate="visible">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Transfer Request
          </CardTitle>
          <CardDescription>
            Enter the email address of the person you want to transfer this vehicle to.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {hasActiveRequest && pendingRequest
            ? (
                <PendingTransferRequestCard
                  pendingRequest={pendingRequest}
                  onCancel={onCancelRequest}
                  isLoading={isCancelLoading}
                />
              )
            : (
                <TransferRequestForm vehicleUUID={vehicleId} />
              )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
