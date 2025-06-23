import { MapPin, Navigation, RefreshCw, Share2, Target } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import type { DiagnosticWithParsedDates, LocationWithParsedDates, VehicleWithParsedDates } from "@/features/vehicles/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import type { VehicleMapRef } from "../map/vehicle-location-map";

import { VehicleLocationMap } from "../map/vehicle-location-map";
import { VehicleRecentLocationsCardSkeleton } from "./skeletons/vehicle-recent-locations-card-skeleton";

type VehicleRecentLocationsCardProps = {
  isLoadingLocations: boolean;
  locations: LocationWithParsedDates[] | null | undefined;
  vehicle: VehicleWithParsedDates | null | undefined;
  latestDiagnostic: DiagnosticWithParsedDates | null | undefined;
  isLoadingDiagnostic: boolean;
  onRefresh?: () => void;
};

export function VehicleRecentLocationsCard({
  isLoadingLocations,
  locations,
  vehicle,
  latestDiagnostic,
  isLoadingDiagnostic,
  onRefresh,
}: VehicleRecentLocationsCardProps) {
  const mapRef = useRef<VehicleMapRef>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check if location data is available either from Locations table or Diagnostics table
  const hasLocationFromLocationsTable = !isLoadingLocations && locations && locations.length > 0;
  const hasLocationFromDiagnostics = !isLoadingDiagnostic && latestDiagnostic
    && latestDiagnostic.locationLat !== null && latestDiagnostic.locationLong !== null;

  // Use location data from Locations table if available, otherwise use data from Diagnostics table
  const hasLocationData = hasLocationFromLocationsTable || hasLocationFromDiagnostics;

  // Determine which location data to use
  const locationData = hasLocationFromLocationsTable
    ? {
        latitude: locations![0].latitude,
        longitude: locations![0].longitude,
        timestamp: locations![0].timestamp,
      }
    : hasLocationFromDiagnostics
      ? {
          latitude: latestDiagnostic!.locationLat!,
          longitude: latestDiagnostic!.locationLong!,
          timestamp: latestDiagnostic!.createdAt,
        }
      : null;

  const getTimeElapsed = (timestamp: string) => {
    if (!timestamp)
      return "Unknown";

    const recordedDate = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - recordedDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    }
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
      toast.success("Location data refreshed");
    }
  };

  const handleCenterMap = () => {
    if (mapRef.current) {
      mapRef.current.centerMap();
      toast.success("Map centered on vehicle");
    }
  };

  const handleShareLocation = (mapType: "google" | "apple" | "waze" | "osm") => {
    if (!locationData) {
      toast.error("No location data to share");
      return;
    }

    const { latitude, longitude } = locationData;
    let url = "";

    switch (mapType) {
      case "google":
        url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        break;
      case "apple":
        url = `https://maps.apple.com/?q=${latitude},${longitude}`;
        break;
      case "waze":
        url = `https://www.waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
        break;
      case "osm":
        url = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
        break;
      default:
        url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    }

    window.open(url, "_blank");
    toast.success(`Location opened in ${mapType === "osm" ? "OpenStreetMap" : `${mapType.charAt(0).toUpperCase() + mapType.slice(1)} Maps`}`);
  };

  if (isLoadingLocations || isLoadingDiagnostic) {
    return <VehicleRecentLocationsCardSkeleton />;
  }

  return (
    <Card className="w-full md:col-span-2 @container/card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card">
      <CardHeader className="relative">
        <div className="absolute right-4 top-4 flex items-center gap-2">
          {hasLocationData && (
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <Navigation className="size-3" />
              {getTimeElapsed(locationData!.timestamp)}
            </Badge>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh location data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>Vehicle Location</CardDescription>
        <CardTitle className="flex items-center gap-2 @[250px]/card:text-2xl text-xl font-semibold">
          <MapPin className="h-5 w-5" />
          Last Known Position
          {hasLocationFromDiagnostics && !hasLocationFromLocationsTable && (
            <Badge variant="outline" className="ml-2 text-xs">From Diagnostics</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasLocationData
          ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Latitude</span>
                    <span className="font-medium tabular-nums">
                      {locationData!.latitude.toFixed(6)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Longitude</span>
                    <span className="font-medium tabular-nums">
                      {locationData!.longitude.toFixed(6)}
                    </span>
                  </div>
                </div>
                {/* Map implementation */}
                <div className="aspect-[16/9] h-[200px] w-full overflow-hidden">
                  <VehicleLocationMap
                    ref={mapRef}
                    latitude={locationData!.latitude}
                    longitude={locationData!.longitude}
                    timestamp={locationData!.timestamp}
                    make={vehicle?.make}
                    model={vehicle?.model}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {/* Center map button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={handleCenterMap}
                  >
                    <Target className="mr-2 h-3.5 w-3.5" />
                    Center Map
                  </Button>

                  {/* Share location button */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                      >
                        <Share2 className="mr-2 h-3.5 w-3.5" />
                        Share Location
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      sideOffset={4}
                      className="min-w-[var(--radix-dropdown-menu-trigger-width)]"
                      onCloseAutoFocus={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <DropdownMenuItem
                        onClick={() => handleShareLocation("google")}
                        className="cursor-pointer"
                      >
                        Google Maps
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleShareLocation("apple")}
                        className="cursor-pointer"
                      >
                        Apple Maps
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleShareLocation("waze")}
                        className="cursor-pointer"
                      >
                        Waze
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleShareLocation("osm")}
                        className="cursor-pointer"
                      >
                        OpenStreetMap
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )
          : (
              <div className="text-center text-muted-foreground">No location data available</div>
            )}
      </CardContent>
      {hasLocationData && (
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="font-medium">
            Last updated:
            {" "}
            {new Date(locationData!.timestamp).toLocaleString()}
          </div>
          <div className="text-muted-foreground">
            View full route history in the Location tab
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
