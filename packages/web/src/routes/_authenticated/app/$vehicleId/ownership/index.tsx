import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/app/$vehicleId/ownership/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/dashboard/$vehicleId/ownership/"!</div>;
}
