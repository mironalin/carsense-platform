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
    <Alert>
      <MapPin className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
} 