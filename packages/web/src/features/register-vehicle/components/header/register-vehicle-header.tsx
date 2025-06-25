import { motion } from "framer-motion";
import { Car } from "lucide-react";

import { cardAnimation } from "../../utils/animation-variants";

export function RegisterVehicleHeader() {
  return (
    <motion.div
      className="text-center space-y-4"
      variants={cardAnimation}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Car className="h-8 w-8 text-primary" />
        </div>
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to CarSense</h1>
        <p className="text-lg text-muted-foreground">
          Get started by adding your first vehicle or accepting a transfer request
        </p>
      </div>
    </motion.div>
  );
}
