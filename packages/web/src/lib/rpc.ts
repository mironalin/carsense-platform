import { hc } from "hono/client";

import type { AppType } from "@/api/app";

import env from "../../env";

export const client = hc<AppType>(env.NODE_ENV === "production" ? env.API_PROD_URL : env.API_DEV_URL, {
  fetch: ((input, init) => {
    return fetch(input, {
      ...init,
      credentials: "include", // Required for sending cookies cross-origin
    });
  }) satisfies typeof fetch,
});
export const api = client.api;
