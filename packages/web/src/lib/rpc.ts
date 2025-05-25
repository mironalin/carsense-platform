import { hc } from "hono/client";

import type { AppType } from "@/api/app";

export const client = hc<AppType>("http://localhost:3000", {
  fetch: ((input, init) => {
    return fetch(input, {
      ...init,
      credentials: "include", // Required for sending cookies cross-origin
    });
  }) satisfies typeof fetch,
});
export const api = client.api;
