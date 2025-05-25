import { NotFoundPage } from "@/components/not-found-page";
import type { QueryClient } from "@tanstack/react-query";

import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  notFoundComponent: () => <NotFoundPage />,
  errorComponent: () => <div>Error</div>,
  component: () => (
    <>
      <Outlet />
    </>
  ),
});
