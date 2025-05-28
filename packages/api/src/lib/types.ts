import type { Hono } from "hono";
import type { PinoLogger } from "hono-pino";

export type AppBindings = {
  Bindings: {
    ASSETS: Fetcher;
  };
  Variables: {
    logger: PinoLogger;
  };
};

export type AppOpenApi = Hono<AppBindings>;
