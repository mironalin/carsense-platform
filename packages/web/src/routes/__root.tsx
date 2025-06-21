import type { QueryClient } from "@tanstack/react-query";

import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import { ErrorPage } from "@/components/error-page";
import { LoaderPage } from "@/components/loader-page";
import { NotFoundPage } from "@/components/not-found-page";

type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  errorComponent: () => <ErrorPage />,
  notFoundComponent: () => <NotFoundPage />,
  pendingComponent: () => <LoaderPage />,
  component: () => (
    <>
      <Outlet />
    </>
  ),
});
