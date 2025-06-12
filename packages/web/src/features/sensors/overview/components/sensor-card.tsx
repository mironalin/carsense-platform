import { Clock, StarIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import type { SensorCardProps } from "../types";

import { getCategoryIcon } from "../../utils/sensor-categories";
import { calculateProgress, getDataFreshness, getRelativeTime } from "../utils";
import { AnimatedCounter } from "./animated-counter";
import { MiniHistoryChart } from "./mini-history-chart";
import { ReadingNavigation } from "./reading-navigation";
import { ScrollingText } from "./scrolling-text";
import { SensorHistoryDialog } from "./sensor-history-dialog";

export function SensorCard({
  title,
  value,
  unit,
  categoryIcon,
  category,
  isLoading,
  minValue,
  maxValue,
  timestamp,
  readings,
  snapshotReadings,
  delayAnimation = 0,
  isFavorite = false,
  onToggleFavorite,
}: SensorCardProps) {
  // State to track the current reading index within the snapshot
  const [currentReadingIndex, setCurrentReadingIndex] = useState(0);

  // Create default snapshot readings if none provided
  const effectiveSnapshotReadings = useMemo(() => {
    if (snapshotReadings && snapshotReadings.length > 0) {
      return snapshotReadings;
    }

    // Create a single reading from the current value and timestamp
    if (value !== null && value !== undefined) {
      return [{ value, timestamp: timestamp || new Date().toISOString() }];
    }

    return [];
  }, [snapshotReadings, value, timestamp]);

  // Reset the reading index when snapshot readings change
  useEffect(() => {
    if (effectiveSnapshotReadings.length > 0) {
      setCurrentReadingIndex(0);
    }
  }, [effectiveSnapshotReadings]);

  // Ensure the current reading index is valid
  const validReadingIndex = effectiveSnapshotReadings && effectiveSnapshotReadings.length > 0
    ? Math.min(currentReadingIndex, effectiveSnapshotReadings.length - 1)
    : 0;

  // If we have snapshot readings, use the current one instead of the provided value
  const currentValue = effectiveSnapshotReadings && effectiveSnapshotReadings.length > 0 && effectiveSnapshotReadings[validReadingIndex]
    ? effectiveSnapshotReadings[validReadingIndex].value
    : value;

  // Use timestamp from current snapshot reading if available
  const currentTimestamp = effectiveSnapshotReadings && effectiveSnapshotReadings.length > 0 && effectiveSnapshotReadings[validReadingIndex]
    ? effectiveSnapshotReadings[validReadingIndex].timestamp
    : timestamp;

  // Calculate progress with proper bounds checking
  const progress = calculateProgress(currentValue, minValue ?? 0, maxValue ?? 100);
  const freshness = getDataFreshness(currentTimestamp);
  const relativeTime = getRelativeTime(currentTimestamp);

  if (isLoading) {
    return (
      <Card className="@container/card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card">
        <CardHeader className="pb-2 pt-3 px-4">
          <div className="flex items-center justify-between gap-2">
            <div className="relative flex-1 overflow-hidden">
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Skeleton className="h-6 w-16 rounded-lg" />
            </div>
          </div>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold mt-1">
            <Skeleton className="h-8 w-1/3" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-1.5 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`@container/card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card overflow-hidden border-l-4 ${
        freshness === "recent"
          ? "border-l-green-500"
          : freshness === "stale"
            ? "border-l-yellow-500"
            : "border-l-gray-300"
      }`}
      style={{
        opacity: 0,
        animation: `fadeSlideUp 300ms ${delayAnimation}ms forwards`,
      }}
    >
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="grid grid-cols-[1fr_auto] items-center w-full gap-2">
          <div className="min-w-0">
            <ScrollingText text={title} className="text-sm text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className="flex items-center h-6 gap-1 rounded-lg text-xs shrink-0 whitespace-nowrap px-2">
              {typeof categoryIcon === "string"
                ? getCategoryIcon(categoryIcon)
                : categoryIcon}
              {category}
            </Badge>
            {onToggleFavorite && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-0 shrink-0"
                onClick={onToggleFavorite}
              >
                <StarIcon className={`h-4 w-4 ${isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                <span className="sr-only">{isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
              </Button>
            )}
          </div>
        </div>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums flex items-baseline gap-2 mt-1">
          {currentValue !== null && currentValue !== undefined
            ? <AnimatedCounter value={currentValue} unit={unit} duration={400} />
            : "N/A"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {(minValue !== null || maxValue !== null) && (
          <div className="space-y-1">
            <Progress
              value={progress}
              className="h-1.5"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{minValue !== null && minValue !== undefined ? `Min: ${minValue} ${unit}` : `Min: 0 ${unit}`}</span>
              <span>{maxValue !== null && maxValue !== undefined ? `Max: ${maxValue} ${unit}` : ""}</span>
            </div>
          </div>
        )}

        <MiniHistoryChart readings={readings} unit={unit} />

        {/* Reading navigation for readings within a snapshot */}
        {effectiveSnapshotReadings && effectiveSnapshotReadings.length > 0 && (
          <ReadingNavigation
            readings={effectiveSnapshotReadings}
            currentReadingIndex={validReadingIndex}
            onReadingChange={setCurrentReadingIndex}
          />
        )}

        <div className="flex justify-between items-center pt-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`flex items-center gap-1 cursor-help text-xs ${
                  freshness === "recent"
                    ? "text-green-600"
                    : freshness === "stale"
                      ? "text-yellow-600"
                      : "text-muted-foreground"
                }`}
                >
                  <Clock className="size-3" />
                  {relativeTime}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Last reading time</p>
                {currentTimestamp && <p>{new Date(currentTimestamp).toLocaleString()}</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {readings && readings.length > 0 && (
            <SensorHistoryDialog
              title={title}
              readings={readings}
              unit={unit}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
