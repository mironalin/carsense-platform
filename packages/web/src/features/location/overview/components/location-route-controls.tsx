import { motion } from "framer-motion";
import { Route, Target } from "lucide-react";

import { Button } from "@/components/ui/button";

type LocationRouteControlsProps = {
  onCenterMap: () => void;
  onFitToBounds: () => void;
};

export function LocationRouteControls({ onCenterMap, onFitToBounds }: LocationRouteControlsProps) {
  return (
    <motion.div 
      className="mt-4 pt-4 border-t space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={onCenterMap}
        className="w-full"
      >
        <Target className="mr-2 h-4 w-4" />
        Center Map
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onFitToBounds}
        className="w-full"
      >
        <Route className="mr-2 h-4 w-4" />
        Fit to Route
      </Button>
    </motion.div>
  );
} 