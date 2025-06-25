import { motion } from "framer-motion";
import { Mail } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { TransferRequest } from "../../types";

import { cardAnimation } from "../../utils/animation-variants";
import { TransferRequestCard } from "../cards/transfer-request-card";

type TransferRequestsSectionProps = {
  transferRequests: TransferRequest[];
  onRespond: (requestUuid: string, action: "accept" | "reject") => Promise<void>;
  isLoading?: boolean;
};

export function TransferRequestsSection({
  transferRequests,
  onRespond,
  isLoading = false,
}: TransferRequestsSectionProps) {
  if (transferRequests.length === 0) {
    return null;
  }

  return (
    <motion.div
      variants={cardAnimation}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.1 }}
    >
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Incoming Vehicle Transfer Requests
          </CardTitle>
          <CardDescription>
            You have
            {" "}
            {transferRequests.length}
            {" "}
            pending transfer request
            {transferRequests.length > 1 ? "s" : ""}
            {" "}
            waiting for your response.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {transferRequests.map(request => (
            <TransferRequestCard
              key={request.uuid}
              request={request}
              onRespond={onRespond}
              isLoading={isLoading}
            />
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
