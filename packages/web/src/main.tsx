import type { ToasterProps } from "sonner";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "sonner";

import "./index.css";
import { ThemeProvider, useTheme } from "./components/theme-provider";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
// Create a new query client
const queryClient = new QueryClient();

// Create a new router instance with the query client
const router = createRouter({ routeTree, context: { queryClient } });

// Register the router instance for type safety

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function ToasterWrapper() {
  const { theme } = useTheme();
  return <Toaster theme={theme as ToasterProps["theme"]} />;
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RouterProvider router={router} context={{ queryClient }} />
          <ToasterWrapper />
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
