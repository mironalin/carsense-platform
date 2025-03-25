import type { Hono } from "hono";
import type { PinoLogger } from "hono-pino";

export interface AppBindings {
  Variables: {
    logger: PinoLogger;
  };
}

export type AppOpenApi = Hono<AppBindings>;
