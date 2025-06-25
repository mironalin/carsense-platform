import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/app/$vehicleId/")({
  beforeLoad: async ({ params }) => {
    throw redirect({ to: "/app/$vehicleId/dashboard", params: { vehicleId: params.vehicleId } });
  },
});
