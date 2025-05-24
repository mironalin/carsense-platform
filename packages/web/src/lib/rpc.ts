import { hc } from "hono/client";

import type { AppType } from "@/api/app";

export const client = hc<AppType>("http://localhost:3000");
export const api = client.api;
