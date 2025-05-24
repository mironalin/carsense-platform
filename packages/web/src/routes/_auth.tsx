import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    const { data: sessionPayload, error: sessionError } = await authClient.getSession();

    if (sessionError) {
      console.warn("Error fetching session in _auth beforeLoad:", sessionError);
    }

    if (sessionPayload?.session) {
      throw redirect({
        to: "/",
        replace: true,
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="min-h-screen flex flex-col">
      <Outlet />
    </main>
  );
}
