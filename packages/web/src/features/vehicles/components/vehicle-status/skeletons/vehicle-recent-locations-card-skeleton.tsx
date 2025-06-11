import { MapPin, Navigation, RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function VehicleRecentLocationsCardSkeleton() {
  return (
    <Card className="w-full md:col-span-2 @container/card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card">
      <CardHeader className="relative">
        <div className="absolute right-4 top-4 flex items-center gap-2">
          <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
            <Navigation className="size-3" />
            Loading...
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled
                >
                  <RefreshCw className="h-4 w-4" />
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
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Latitude</span>
              <Skeleton className="mt-1 h-5 w-24" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Longitude</span>
              <Skeleton className="mt-1 h-5 w-24" />
            </div>
          </div>
          <Skeleton className="h-[200px] w-full rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-28 rounded-md" />
            <Skeleton className="h-8 w-32 rounded-md" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="font-medium">
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-4 w-56" />
      </CardFooter>
    </Card>
  );
}
