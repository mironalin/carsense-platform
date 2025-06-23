import { MapPin } from "lucide-react";
import { forwardRef } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import type { LocationWithParsedDates } from "../../types";
import type { DiagnosticRouteMapRef } from "../../components/maps/diagnostic-route-map";

import { DiagnosticRouteMap } from "../../components/maps/diagnostic-route-map";

type LocationRouteMapCardProps = {
  locations: LocationWithParsedDates[];
  isLoading: boolean;
};

export const LocationRouteMapCard = forwardRef<DiagnosticRouteMapRef, LocationRouteMapCardProps>(
  ({ locations, isLoading }, ref) => {
    return (
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Vehicle Route
          </CardTitle>
          <CardDescription>
            Interactive map showing the vehicle's path during the diagnostic session
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading
            ? (
                <Skeleton className="h-[400px] w-full rounded-md" />
              )
            : (
                <DiagnosticRouteMap
                  ref={ref}
                  locations={locations}
                  className="h-[400px] w-full"
                />
              )}
        </CardContent>
      </Card>
    );
  }
);

LocationRouteMapCard.displayName = "LocationRouteMapCard"; 