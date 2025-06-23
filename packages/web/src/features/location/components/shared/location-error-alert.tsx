import { AlertTriangle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type LocationErrorAlertProps = {
  title?: string;
  description?: string;
};

export function LocationErrorAlert({ 
  title = "Error", 
  description = "Failed to load location data. Please try again later." 
}: LocationErrorAlertProps) {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
} 