import { createFileRoute } from "@tanstack/react-router";

import { LocationPage } from "@/features/location/components/pages/location-page";
import { ErrorPage } from "@/components/error-page";
import { LoaderPage } from "@/components/loader-page";
import { NotFoundPage } from "@/components/not-found-page";
import { getVehicleDiagnosticsQueryOptions } from "@/features/vehicles/api/use-get-vehicle-diagnostics";

export const Route = createFileRoute(
  "/_authenticated/app/$vehicleId/location/",
)({
  loader: async ({ context, params }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(getVehicleDiagnosticsQueryOptions({ vehicleId: params.vehicleId }));
  },
  component: RouteComponent,
  pendingComponent: () => <LoaderPage />,
  notFoundComponent: () => <NotFoundPage />,
  errorComponent: () => <ErrorPage />,
});

function RouteComponent() {
  const { vehicleId } = Route.useParams();

  return (
    <div className="flex-1 space-y-4 p-4 lg:p-6 pt-4">
      <LocationPage vehicleId={vehicleId} />
    </div>
  );
}
