import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";

import { buttonAnimation, cardAnimation } from "../../utils/animation-variants";

type RegisterVehicleFooterProps = {
  onSignOut: () => Promise<void>;
  isSigningOut: boolean;
};

export function RegisterVehicleFooter({ onSignOut, isSigningOut }: RegisterVehicleFooterProps) {
  return (
    <motion.div
      className="flex flex-col items-center space-y-4"
      variants={cardAnimation}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.4 }}
    >
      <p className="text-sm text-muted-foreground text-center">
        Need to switch accounts or sign out?
      </p>
      <motion.div variants={buttonAnimation} whileHover="hover" whileTap="tap">
        <Button
          variant="outline"
          onClick={onSignOut}
          disabled={isSigningOut}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          {isSigningOut ? "Signing out..." : "Sign Out"}
        </Button>
      </motion.div>
    </motion.div>
  );
}
