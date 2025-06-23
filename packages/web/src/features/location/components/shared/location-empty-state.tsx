import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type LocationEmptyStateProps = {
  title?: string;
  description?: string;
};

export function LocationEmptyState({ 
  title = "No location data available", 
  description = "No location data found for this diagnostic session" 
}: LocationEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Alert>
        <MapPin className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    </motion.div>
  );
} 