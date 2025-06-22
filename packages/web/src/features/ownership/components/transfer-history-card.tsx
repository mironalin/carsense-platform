import { motion } from "framer-motion";
import { History } from "lucide-react";

import type { VehicleHistory } from "@/features/ownership/types";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cardAnimation, listAnimation } from "@/features/ownership/utils/animation-variants";

import { TransferHistoryEmptyState } from "./transfer-history-empty-state";
import { TransferHistoryItem } from "./transfer-history-item";

type TransferHistoryCardProps = {
  vehicleHistory?: VehicleHistory;
};

export function TransferHistoryCard({ vehicleHistory }: TransferHistoryCardProps) {
  const hasHistory = vehicleHistory?.transferHistory && vehicleHistory.transferHistory.length > 0;

  return (
    <motion.div variants={cardAnimation} initial="hidden" animate="visible">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Vehicle Transfer History
          </CardTitle>
          <CardDescription>
            Complete ownership history for this vehicle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 rounded-xl overflow-hidden bg-background/80 shadow-sm border border-border/40 dark:border-border/20">
            <div className="h-full relative">
              {/* Top indicator */}
              <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
                <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent dark:via-primary/30"></div>
              </div>

              <ScrollArea className="h-full">
                <motion.div
                  variants={listAnimation}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4 p-6"
                >
                  {hasHistory
                    ? (
                        <div className="space-y-3">
                          {vehicleHistory.transferHistory.map(transfer => (
                            <TransferHistoryItem key={transfer.uuid} transfer={transfer} />
                          ))}
                        </div>
                      )
                    : (
                        <TransferHistoryEmptyState />
                      )}
                </motion.div>
              </ScrollArea>

              {/* Bottom indicator */}
              <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
                <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent dark:via-primary/30"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
