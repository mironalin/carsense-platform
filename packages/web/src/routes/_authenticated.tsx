import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AppSidebar } from "@/components/app-sidebar";
import { ErrorPage } from "@/components/error-page";
import { LoaderPage } from "@/components/loader-page";
import { NotFoundPage } from "@/components/not-found-page";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const { data: sessionPayload, error: sessionError } = await authClient.getSession();

    if (sessionError) {
      console.warn("Error fetching session in _auth beforeLoad:", sessionError);
    }

    if (!sessionPayload?.session) {
      throw redirect({
        to: "/sign-in",
        search: {
          mode: undefined,
          redirect: undefined,
          state: undefined,
        },
      });
    }
  },
  errorComponent: () => <ErrorPage />,
  notFoundComponent: () => <NotFoundPage />,
  pendingComponent: () => <LoaderPage />,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div>
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
