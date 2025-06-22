import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buttonAnimation } from "@/features/notifications/utils/animation-variants";

type TransferActionsProps = {
  transferRequestUUID: string;
  onAccept: (uuid: string) => void;
  onReject: (uuid: string) => void;
  isLoading?: boolean;
  variant?: "inline" | "full";
};

export function TransferActions({
  transferRequestUUID,
  onAccept,
  onReject,
  isLoading = false,
  variant = "inline",
}: TransferActionsProps) {
  const isFullVariant = variant === "full";

  return (
    <div className={`flex gap-2 ${isFullVariant ? "" : ""}`}>
      <motion.div variants={buttonAnimation} whileHover="hover" whileTap="tap">
        <Button
          size="sm"
          onClick={() => onAccept(transferRequestUUID)}
          disabled={isLoading}
          className={isFullVariant ? "flex-1" : ""}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          {isFullVariant ? "Accept Transfer" : "Accept"}
        </Button>
      </motion.div>
      <motion.div variants={buttonAnimation} whileHover="hover" whileTap="tap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onReject(transferRequestUUID)}
          disabled={isLoading}
          className={isFullVariant ? "flex-1" : ""}
        >
          <XCircle className="h-4 w-4 mr-1" />
          {isFullVariant ? "Reject Transfer" : "Reject"}
        </Button>
      </motion.div>
    </div>
  );
}
