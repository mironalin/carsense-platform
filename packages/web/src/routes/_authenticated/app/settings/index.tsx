import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/app/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/app/settings/"!</div>;
}
