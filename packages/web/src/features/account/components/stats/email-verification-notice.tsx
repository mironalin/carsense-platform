import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

export function EmailVerificationNotice() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-4 p-4 bg-muted border border-border rounded-lg"
    >
      <div className="flex items-start gap-2">
        <XCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-foreground">
            Email Verification Required
          </p>
          <p className="text-muted-foreground mt-1">
            Please check your email and click the verification link to secure your account.
          </p>
        </div>
      </div>
    </motion.div>
  );
} 