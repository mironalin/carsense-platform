import { createFileRoute } from "@tanstack/react-router";

import { ErrorPage } from "@/components/error-page";
import { LoaderPage } from "@/components/loader-page";
import { NotFoundPage } from "@/components/not-found-page";
import { getDashboardOverviewQueryOptions } from "@/features/dashboard/api/use-get-dashboard-overview";
import { DashboardPage } from "@/features/dashboard/components/pages/dashboard-page";

export const Route = createFileRoute("/_authenticated/app/$vehicleId/dashboard/")({
  component: DashboardRoute,
  loader: async ({ context, params }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(getDashboardOverviewQueryOptions({ vehicleUUID: params.vehicleId }));
  },
  pendingComponent: () => <LoaderPage />,
  notFoundComponent: () => <NotFoundPage />,
  errorComponent: () => <ErrorPage />,
});

function DashboardRoute() {
  const { vehicleId } = Route.useParams();

  return <DashboardPage vehicleId={vehicleId} />;
}
