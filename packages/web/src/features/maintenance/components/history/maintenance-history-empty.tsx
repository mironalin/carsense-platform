import { motion } from "framer-motion";
import { WrenchIcon } from "lucide-react";

export function MaintenanceHistoryEmpty() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="mx-auto w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
        <WrenchIcon className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">No maintenance records yet</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        Start tracking your vehicle's maintenance history by adding your first service entry above.
      </p>
    </motion.div>
  );
}
