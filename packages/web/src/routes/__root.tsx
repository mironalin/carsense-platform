import type { QueryClient } from "@tanstack/react-query";

import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import { LoaderPage } from "@/components/loader-page";
import { NotFoundPage } from "@/components/not-found-page";

type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  errorComponent: () => <div>Error</div>,
  notFoundComponent: () => <NotFoundPage />,
  wrapInSuspense: true,
  pendingComponent: () => <LoaderPage />,
  // loader: () => void 0,
  component: () => (
    <>
      <Outlet />
    </>
  ),
});
