import { motion } from "framer-motion";
import { Navigation } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import type { LocationWithParsedDates } from "../../types";

import { calculateRouteStats, formatDuration, formatSpeed, formatTime } from "../../utils/location-utils";
import { LocationRouteControls } from "./location-route-controls";
import { itemVariants } from "../../utils/animation-variants";

type LocationRouteStatsProps = {
  locations: LocationWithParsedDates[];
  isLoading: boolean;
  onCenterMap: () => void;
  onFitToBounds: () => void;
};

export function LocationRouteStats({ 
  locations, 
  isLoading, 
  onCenterMap, 
  onFitToBounds 
}: LocationRouteStatsProps) {
  const routeStats = calculateRouteStats(locations);

  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Route Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading
            ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              )
            : routeStats
              ? (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Points:</span>
                      <span className="font-medium">{routeStats.totalPoints}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Start Time:</span>
                      <span className="font-medium">
                        {formatTime(routeStats.startTime)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">End Time:</span>
                      <span className="font-medium">
                        {formatTime(routeStats.endTime)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">
                        {formatDuration(routeStats.duration)}
                      </span>
                    </div>
                    {routeStats.maxSpeed > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Speed:</span>
                        <span className="font-medium">
                          {formatSpeed(routeStats.maxSpeed)}
                        </span>
                      </div>
                    )}
                    {routeStats.avgSpeed > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Speed:</span>
                        <span className="font-medium">
                          {formatSpeed(routeStats.avgSpeed)}
                        </span>
                      </div>
                    )}
                  </div>
                )
              : (
                  <p className="text-sm text-muted-foreground">
                    No location data available for this diagnostic session
                  </p>
                )}

          {/* Map Controls */}
          {locations.length > 0 && (
            <LocationRouteControls
              onCenterMap={onCenterMap}
              onFitToBounds={onFitToBounds}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
} 