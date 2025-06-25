import { createFileRoute } from "@tanstack/react-router";

import { ErrorPage } from "@/components/error-page";
import { LoaderPage } from "@/components/loader-page";
import { NotFoundPage } from "@/components/not-found-page";
import { getTransferRequestsQueryOptions } from "@/features/ownership/api/use-get-transfer-requests";
import { RegisterVehiclePage } from "@/features/register-vehicle/components/pages/register-vehicle-page";

export const Route = createFileRoute("/_authenticated/app/register-vehicle/")({
  loader: async ({ context }) => {
    const queryClient = context.queryClient;
    await queryClient.prefetchQuery(getTransferRequestsQueryOptions());
  },
  component: RouteComponent,
  pendingComponent: () => <LoaderPage />,
  notFoundComponent: () => <NotFoundPage />,
  errorComponent: () => <ErrorPage />,
});

function RouteComponent() {
  return <RegisterVehiclePage />;
}
