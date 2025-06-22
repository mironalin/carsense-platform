import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fadeAnimation } from "@/features/ownership/utils/animation-variants";

export function TransferNotificationAlert() {
  return (
    <motion.div variants={fadeAnimation}>
      <Alert>
        <ArrowUpRight className="h-4 w-4" />
        <AlertTitle>Need to accept transfer requests?</AlertTitle>
        <AlertDescription>
          <span>
            Transfer requests you receive from others can be found in the
            {" "}
            <Link to="/app/notifications" className="font-medium underline">
              Notifications page
            </Link>
            , where you can accept or reject vehicle transfers offered to you.
          </span>
        </AlertDescription>
      </Alert>
    </motion.div>
  );
}
