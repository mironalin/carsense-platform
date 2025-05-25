import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing-page")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_landing-page"!</div>;
}
