import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import type { ReadingNavigationProps } from "../types";

export function ReadingNavigation({
  readings,
  currentReadingIndex,
  onReadingChange,
}: ReadingNavigationProps) {
  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    if (!timestamp)
      return "Unknown time";
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
    }
    catch (error) {
      console.error("Error formatting timestamp:", error);
      return "Invalid time";
    }
  };

  // If no readings, return null
  if (!readings || readings.length === 0) {
    return null;
  }

  // Ensure the index is valid
  const safeIndex = Math.min(Math.max(0, currentReadingIndex), readings.length - 1);
  const currentReading = readings[safeIndex];

  if (!currentReading) {
    return null;
  }

  return (
    <div className="flex items-center justify-between mt-1 text-xs">
      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0"
                disabled={safeIndex <= 0}
                onClick={() => onReadingChange(safeIndex - 1)}
              >
                <ChevronLeft className="h-3 w-3" />
                <span className="sr-only">Previous reading</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start" className="text-xs">
              Previous reading
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <span className="text-muted-foreground">
          {safeIndex + 1}
          /
          {readings.length}
        </span>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0"
                disabled={safeIndex >= readings.length - 1}
                onClick={() => onReadingChange(safeIndex + 1)}
              >
                <ChevronRight className="h-3 w-3" />
                <span className="sr-only">Next reading</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end" className="text-xs">
              Next reading
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {currentReading && currentReading.timestamp && (
        <span className="text-muted-foreground">
          {formatTimestamp(currentReading.timestamp)}
        </span>
      )}
    </div>
  );
}
