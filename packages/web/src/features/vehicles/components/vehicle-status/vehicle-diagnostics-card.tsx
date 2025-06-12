import { Activity, BarChart3, MapPin, TrendingUpIcon } from "lucide-react";

import type { DiagnosticWithParsedDates } from "@/features/vehicles/types";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { VehicleDiagnosticsCardSkeleton } from "./skeletons/vehicle-diagnostics-card-skeleton";

type VehicleDiagnosticsCardProps = {
  latestDiagnostic: DiagnosticWithParsedDates | null | undefined;
  isLoadingDiagnostic: boolean;
};

export function VehicleDiagnosticsCard({ isLoadingDiagnostic, latestDiagnostic }: VehicleDiagnosticsCardProps) {
  const getTimeElapsed = () => {
    if (!latestDiagnostic?.createdAt)
      return "Unknown";

    const createdDate = new Date(latestDiagnostic.createdAt);
    const now = new Date();
    const diffMs = now.getTime() - createdDate.getTime();
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

  if (isLoadingDiagnostic) {
    return <VehicleDiagnosticsCardSkeleton />;
  }

  return (
    <Card className="w-full @container/card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card">
      <CardHeader className="relative">
        <CardDescription>Vehicle Status</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {latestDiagnostic ? `${latestDiagnostic.odometer} km` : "N/A"}
        </CardTitle>
        <div className="absolute right-4 top-4">
          <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
            <BarChart3 className="size-3" />
            {latestDiagnostic
              ? getTimeElapsed()
              : "No data"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {latestDiagnostic
          ? (
              <div className="grid grid-cols-1 gap-2">
                {latestDiagnostic.locationLat && latestDiagnostic.locationLong && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Location</span>
                    </div>
                    <span className="font-medium">
                      {latestDiagnostic.locationLat.toFixed(4)}
                      ,
                      {latestDiagnostic.locationLong.toFixed(4)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Updated</span>
                  </div>
                  <span className="font-medium">
                    {new Date(latestDiagnostic.createdAt!).toLocaleDateString()}
                  </span>
                </div>
                {latestDiagnostic.notes && (
                  <div className="mt-2 border-t pt-2">
                    <span className="text-sm text-muted-foreground">Notes</span>
                    <p className="mt-1 text-sm">{latestDiagnostic.notes}</p>
                  </div>
                )}
              </div>
            )
          : (
              <div className="text-center text-muted-foreground">No diagnostic data available</div>
            )}
      </CardContent>
      {latestDiagnostic && (
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Regular maintenance recommended
            {" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Vehicle is operating normally
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
