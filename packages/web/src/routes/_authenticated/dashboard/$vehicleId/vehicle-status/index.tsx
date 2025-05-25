import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/dashboard/$vehicleId/vehicle-status/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>Hello "/_authenticated/dashboard/$vehicleId/vehicle-status/"!</div>
  );
}
