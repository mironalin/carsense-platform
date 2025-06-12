import { BarChart, Car, Droplet, Hash, Key, Settings } from "lucide-react";

import type { VehicleWithParsedDates } from "@/features/vehicles/types";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { VehicleInformationCardSkeleton } from "./skeletons/vehicle-information-card-skeleton";

type VehicleInformationCardProps = {
  vehicle: VehicleWithParsedDates | null | undefined;
  isLoadingVehicle: boolean;
};

export function VehicleInformationCard({ vehicle, isLoadingVehicle }: VehicleInformationCardProps) {
  if (isLoadingVehicle) {
    return <VehicleInformationCardSkeleton />;
  }

  return (
    <Card className="w-full @container/card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card">
      <CardHeader className="relative">
        <CardDescription>Vehicle Information</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold">
          {vehicle?.make}
          {" "}
          {vehicle?.model}
        </CardTitle>
        <div className="absolute right-4 top-4">
          <Badge variant="outline" className="flex gap-1 rounded-lg">
            {vehicle?.year}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {vehicle
          ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div className="flex flex-col">
                  <div className="mb-1 flex items-center gap-1.5">
                    <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">VIN</span>
                  </div>
                  <span className="font-medium">{vehicle.vin || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                  <div className="mb-1 flex items-center gap-1.5">
                    <Key className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">License Plate</span>
                  </div>
                  <span className="font-medium">{vehicle.licensePlate}</span>
                </div>
                <div className="flex flex-col">
                  <div className="mb-1 flex items-center gap-1.5">
                    <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Engine Type</span>
                  </div>
                  <span className="font-medium">{vehicle.engineType}</span>
                </div>
                <div className="flex flex-col">
                  <div className="mb-1 flex items-center gap-1.5">
                    <Droplet className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Fuel Type</span>
                  </div>
                  <span className="font-medium">{vehicle.fuelType}</span>
                </div>
                <div className="flex flex-col">
                  <div className="mb-1 flex items-center gap-1.5">
                    <BarChart className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Transmission</span>
                  </div>
                  <span className="font-medium">{vehicle.transmissionType}</span>
                </div>
                <div className="flex flex-col">
                  <div className="mb-1 flex items-center gap-1.5">
                    <Car className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Drivetrain</span>
                  </div>
                  <span className="font-medium">{vehicle.drivetrain}</span>
                </div>
              </div>
            )
          : (
              <div className="text-center text-muted-foreground">Vehicle information not available</div>
            )}
      </CardContent>
    </Card>
  );
}
