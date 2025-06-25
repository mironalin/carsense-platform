import { createFileRoute, redirect } from "@tanstack/react-router";

import { getVehiclesQueryOptions } from "@/features/vehicles/api/use-get-vehicles";

export const Route = createFileRoute("/_authenticated/app/")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    const vehicles = await queryClient.fetchQuery(getVehiclesQueryOptions);

    if (vehicles.length === 0) {
      throw redirect({ to: "/app/register-vehicle" });
    }
    else {
      throw redirect({ to: "/app/$vehicleId/analytics", params: { vehicleId: vehicles[vehicles.length - 1].uuid } });
    }
  },
});
