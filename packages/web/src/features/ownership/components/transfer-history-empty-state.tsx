import { motion } from "framer-motion";
import { History } from "lucide-react";

import { listItemAnimation } from "@/features/ownership/utils/animation-variants";

export function TransferHistoryEmptyState() {
  return (
    <motion.div variants={listItemAnimation}>
      <div className="text-center py-8">
        <History className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          No transfer history yet
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          This vehicle has not been transferred between users
        </p>
      </div>
    </motion.div>
  );
}
