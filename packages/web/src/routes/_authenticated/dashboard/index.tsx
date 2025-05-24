import { createFileRoute } from "@tanstack/react-router";

import { ModeToggle } from "@/components/mode-toggle";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <h1>Dashboard</h1>
      <ModeToggle />
    </>
  );
}
