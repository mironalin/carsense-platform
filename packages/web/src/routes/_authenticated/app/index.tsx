import { createFileRoute, redirect } from "@tanstack/react-router";

import { getVehiclesQueryOptions } from "@/features/vehicles/api/use-get-vehicles";

export const Route = createFileRoute("/_authenticated/app/")({
  loader: async ({ context }) => {
    const queryClient = context.queryClient;
    const vehicles = await queryClient.fetchQuery(getVehiclesQueryOptions);

    if (vehicles.length === 0) {
      // throw redirect({to: "/vehicles"});
    }
    else {
      throw redirect({ to: "/app/$vehicleId/dashboard", params: { vehicleId: vehicles[vehicles.length - 1].uuid } });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/dashboard/"!</div>;
}
