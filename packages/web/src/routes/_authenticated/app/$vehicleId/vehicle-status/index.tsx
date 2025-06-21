import { createFileRoute, useParams } from "@tanstack/react-router";

import { ErrorPage } from "@/components/error-page";
import { LoaderPage } from "@/components/loader-page";
import { NotFoundPage } from "@/components/not-found-page";
import { getLatestDiagnosticQueryOptions, useGetLatestDiagnostic } from "@/features/vehicles/api/use-get-latest-diagnostic";
import { getVehicleByIdQueryOptions, useGetVehicleById } from "@/features/vehicles/api/use-get-vehicle-by-id";
import { getVehicleRecentLocationsQueryOptions, useGetVehicleRecentLocations } from "@/features/vehicles/api/use-get-vehicle-recent-locations";
import { VehicleDiagnosticsCard } from "@/features/vehicles/components/vehicle-status/vehicle-diagnostics-card";
import { VehicleInformationCard } from "@/features/vehicles/components/vehicle-status/vehicle-information-card";
import { VehicleRecentLocationsCard } from "@/features/vehicles/components/vehicle-status/vehicle-recent-locations-card";

export const Route = createFileRoute(
  "/_authenticated/app/$vehicleId/vehicle-status/",
)({
  loader: async ({ context, params }) => {
    const { queryClient } = context;
    await Promise.all([
      queryClient.prefetchQuery(getVehicleByIdQueryOptions({ vehicleId: params.vehicleId })),
      queryClient.prefetchQuery(getLatestDiagnosticQueryOptions({ vehicleId: params.vehicleId })),
      queryClient.prefetchQuery(getVehicleRecentLocationsQueryOptions({ vehicleId: params.vehicleId })),
    ]);
  },
  pendingComponent: () => <LoaderPage />,
  notFoundComponent: () => <NotFoundPage />,
  errorComponent: () => <ErrorPage />,
  component: VehicleStatusComponent,
});

function VehicleStatusComponent() {
  const { vehicleId } = useParams({ strict: false });
  const { data: vehicle, isPending: isLoadingVehicle } = useGetVehicleById({ vehicleId: vehicleId!, suspense: true });
  const { data: latestDiagnostic, isPending: isLoadingDiagnostic } = useGetLatestDiagnostic({ vehicleId: vehicleId!, suspense: true });
  const {
    data: locations,
    isPending: isLoadingLocations,
    refetch: refetchLocations,
  } = useGetVehicleRecentLocations({ vehicleId: vehicleId!, limit: 1, suspense: true });

  const handleRefreshLocations = async () => {
    await refetchLocations();
  };

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
