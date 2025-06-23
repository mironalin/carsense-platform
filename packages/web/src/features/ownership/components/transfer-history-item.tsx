import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle } from "lucide-react";

import type { TransferHistoryEntry } from "@/features/ownership/types";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { listItemAnimation } from "@/features/ownership/utils/animation-variants";
import { formatDate } from "@/features/ownership/utils/ownership-utils";

type TransferHistoryItemProps = {
  transfer: TransferHistoryEntry;
};

export function TransferHistoryItem({ transfer }: TransferHistoryItemProps) {
  return (
    <motion.div variants={listItemAnimation}>
      <Card>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium text-sm">
                    {transfer.fromUserName || transfer.fromUserEmail || "Unknown User"}
                    <span className="text-muted-foreground mx-2">→</span>
                    {transfer.toUserName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(transfer.transferredAt)}
                  </p>
                </div>
              </div>
              <Badge variant="default" className="">
                <CheckCircle className="h-3 w-3" />
                Completed
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
