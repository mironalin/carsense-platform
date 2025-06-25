import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { ErrorPage } from "@/components/error-page";
import { LoaderPage } from "@/components/loader-page";
import { NotFoundPage } from "@/components/not-found-page";
import { getVehiclesQueryOptions } from "@/features/vehicles/api/use-get-vehicles";

export const Route = createFileRoute("/_authenticated/app/register-vehicle")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    const vehicles = await queryClient.fetchQuery(getVehiclesQueryOptions);

    if (vehicles.length > 0) {
      throw redirect({ to: "/app" });
    }
  },
  component: RouteComponent,
  pendingComponent: () => <LoaderPage />,
  notFoundComponent: () => <NotFoundPage />,
  errorComponent: () => <ErrorPage />,
});

function RouteComponent() {
  return <Outlet />;
}
