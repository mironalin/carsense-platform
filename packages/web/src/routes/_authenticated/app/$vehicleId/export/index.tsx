import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/app/$vehicleId/export/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/dashboard/$vehicleId/export/"!</div>;
}
