import { AccountPage } from "@/features/account/components/pages/account-page";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/_authenticated/app/account/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AccountPage />;
}
