import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Clock, Users, XCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { TransferRequest } from "../../types";

import { buttonAnimation } from "../../utils/animation-variants";
import { formatDate, isExpired } from "../../utils/register-vehicle-utils";

type TransferRequestCardProps = {
  request: TransferRequest;
  onRespond: (requestUuid: string, action: "accept" | "reject") => Promise<void>;
  isLoading?: boolean;
};

export function TransferRequestCard({ request, onRespond, isLoading = false }: TransferRequestCardProps) {
  const expired = isExpired(request.expiresAt);

  return (
    <Card className={expired ? "border-destructive/50" : "border-amber-500/50"}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                Vehicle owner:
                {" "}
                {request.toUserEmail}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              Request sent:
              {" "}
              {formatDate(request.requestedAt)}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              {expired ? "Expired on" : "Expires on"}
              :
              {formatDate(request.expiresAt)}
            </div>
          </div>
          <Badge variant={expired ? "destructive" : "default"}>
            {expired ? "Expired" : "Pending Response"}
          </Badge>
        </div>

        {request.message && (
          <div className="p-3 bg-muted rounded-md mb-4">
            <p className="text-sm">
              <span className="font-medium">Message from owner:</span>
            </p>
            <p className="text-sm mt-1 italic">
              "
              {request.message}
              "
            </p>
          </div>
        )}

        {expired
          ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Request Expired</AlertTitle>
                <AlertDescription>
                  This vehicle transfer request has expired and is no longer valid. You cannot accept or reject expired requests.
                </AlertDescription>
              </Alert>
            )
          : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  This person wants to transfer their vehicle ownership to you. Choose your response:
                </p>
                <div className="flex gap-2">
                  <motion.div
                    variants={buttonAnimation}
                    whileHover="hover"
                    whileTap="tap"
                    className="flex-1"
                  >
                    <Button
                      onClick={() => onRespond(request.uuid, "accept")}
                      disabled={isLoading}
                      className="w-full"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept & Become Owner
                    </Button>
                  </motion.div>
                  <motion.div
                    variants={buttonAnimation}
                    whileHover="hover"
                    whileTap="tap"
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      onClick={() => onRespond(request.uuid, "reject")}
                      disabled={isLoading}
                      className="w-full"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Decline Request
                    </Button>
                  </motion.div>
                </div>
              </div>
            )}
      </CardContent>
    </Card>
  );
}
