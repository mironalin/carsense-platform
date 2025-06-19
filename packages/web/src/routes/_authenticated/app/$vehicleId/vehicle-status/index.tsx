import { createFileRoute, useParams } from "@tanstack/react-router";

import { useGetLatestDiagnostic } from "@/features/vehicles/api/use-get-latest-diagnostic";
import { useGetVehicleById } from "@/features/vehicles/api/use-get-vehicle-by-id";
import { useGetVehicleRecentLocations } from "@/features/vehicles/api/use-get-vehicle-recent-locations";
import { VehicleDiagnosticsCard } from "@/features/vehicles/components/vehicle-status/vehicle-diagnostics-card";
import { VehicleInformationCard } from "@/features/vehicles/components/vehicle-status/vehicle-information-card";
import { VehicleRecentLocationsCard } from "@/features/vehicles/components/vehicle-status/vehicle-recent-locations-card";

export const Route = createFileRoute(
  "/_authenticated/app/$vehicleId/vehicle-status/",
)({
  component: VehicleStatusComponent,
});

function VehicleStatusComponent() {
  const { vehicleId } = useParams({ strict: false });
  const { data: vehicle, isPending: isLoadingVehicle } = useGetVehicleById(vehicleId!);
  const { data: latestDiagnostic, isPending: isLoadingDiagnostic } = useGetLatestDiagnostic(vehicleId!);
  const {
    data: locations,
    isPending: isLoadingLocations,
    refetch: refetchLocations,
  } = useGetVehicleRecentLocations(vehicleId!, 1);

  const handleRefreshLocations = async () => {
    await refetchLocations();
  };

  //  className="flex flex-col gap-4 py-4 md:gap-6 md:py-6"

  return (
    <div className="w-full space-y-4 p-4 lg:p-6">
      <div className="grid w-full grid-cols-1 gap-4 lg:gap-6 md:grid-cols-2">
        <VehicleInformationCard
          vehicle={vehicle}
          isLoadingVehicle={isLoadingVehicle}
        />
        <VehicleDiagnosticsCard
          latestDiagnostic={latestDiagnostic}
          isLoadingDiagnostic={isLoadingDiagnostic}
        />
        <VehicleRecentLocationsCard
          vehicle={vehicle}
          locations={locations}
          isLoadingLocations={isLoadingLocations}
          latestDiagnostic={latestDiagnostic}
          isLoadingDiagnostic={isLoadingDiagnostic}
          onRefresh={handleRefreshLocations}
        />
      </div>
    </div>
  );
}
