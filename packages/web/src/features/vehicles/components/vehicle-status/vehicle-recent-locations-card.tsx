import { MapPin, Navigation, RefreshCw, Share2, Target } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import type { LocationWithParsedDates, VehicleWithParsedDates } from "@/lib/types";

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
  onRefresh?: () => void;
};

export function VehicleRecentLocationsCard({
  isLoadingLocations,
  locations,
  vehicle,
  onRefresh,
}: VehicleRecentLocationsCardProps) {
  const mapRef = useRef<VehicleMapRef>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const hasLocationData = !isLoadingLocations && locations && locations.length > 0;

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

  const getMapLinks = () => {
    if (!hasLocationData) {
      return {
        google: "",
        apple: "",
        waze: "",
        osm: "",
      };
    }

    const { latitude, longitude } = locations[0];
    const vehicleName = `${vehicle?.make || ""} ${vehicle?.model || "Vehicle"}`;

    return {
      google: `https://www.google.com/maps?q=${latitude},${longitude}`,
      apple: `http://maps.apple.com/?q=${vehicleName}&ll=${latitude},${longitude}`,
      waze: `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`,
      osm: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`,
    };
  };

  const handleShareLocation = (service: "google" | "apple" | "waze" | "osm") => {
    if (!hasLocationData)
      return;

    const mapLinks = getMapLinks();
    let link: string;
    let serviceName: string;

    switch (service) {
      case "google":
        link = mapLinks.google;
        serviceName = "Google Maps";
        break;
      case "apple":
        link = mapLinks.apple;
        serviceName = "Apple Maps";
        break;
      case "waze":
        link = mapLinks.waze;
        serviceName = "Waze";
        break;
      case "osm":
        link = mapLinks.osm;
        serviceName = "OpenStreetMap";
        break;
      default:
        link = mapLinks.google;
        serviceName = "Google Maps";
    }

    navigator.clipboard.writeText(link)
      .then(() => toast.success(`Link copied for ${serviceName}`))
      .catch(() => toast.error("Failed to copy location link"));
  };

  if (isLoadingLocations) {
    return <VehicleRecentLocationsCardSkeleton />;
  }

  return (
    <Card className="w-full md:col-span-2 @container/card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card">
      <CardHeader className="relative">
        <div className="absolute right-4 top-4 flex items-center gap-2">
          {hasLocationData && (
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <Navigation className="size-3" />
              {getTimeElapsed(locations[0].timestamp)}
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
                      {locations[0].latitude.toFixed(6)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Longitude</span>
                    <span className="font-medium tabular-nums">
                      {locations[0].longitude.toFixed(6)}
                    </span>
                  </div>
                </div>
                {/* Map implementation */}
                <div className="aspect-[16/9] h-[200px] w-full overflow-hidden">
                  <VehicleLocationMap
                    ref={mapRef}
                    latitude={locations[0].latitude}
                    longitude={locations[0].longitude}
                    timestamp={locations[0].timestamp}
                    make={vehicle?.make}
                    model={vehicle?.model}
                  />
                </div>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" className="flex gap-2" onClick={handleCenterMap}>
                          <Target className="h-4 w-4" />
                          Center Map
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Center map on vehicle</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <DropdownMenu>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="flex gap-2">
                              <Share2 className="h-4 w-4" />
                              Share Location
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Share vehicle location</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
            {new Date(locations[0].timestamp).toLocaleString()}
          </div>
          <div className="text-muted-foreground">
            View full route history in the Location tab
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
