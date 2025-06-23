import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { forwardRef } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import type { LocationWithParsedDates } from "../../types";
import type { DiagnosticRouteMapRef } from "../../components/maps/diagnostic-route-map";

import { DiagnosticRouteMap } from "../../components/maps/diagnostic-route-map";
import { itemVariants } from "../../utils/animation-variants";

type LocationRouteMapCardProps = {
  locations: LocationWithParsedDates[];
  isLoading: boolean;
};

export const LocationRouteMapCard = forwardRef<DiagnosticRouteMapRef, LocationRouteMapCardProps>(
  ({ locations, isLoading }, ref) => {
    return (
      <motion.div variants={itemVariants} className="md:col-span-2">
        <Card className="h-full">
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
      </motion.div>
    );
  }
);

LocationRouteMapCard.displayName = "LocationRouteMapCard"; 