import { createFileRoute } from "@tanstack/react-router";

import { HelpPage } from "@/features/help/components/pages/help-page";

export const Route = createFileRoute("/_authenticated/app/help/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <HelpPage />;
} 