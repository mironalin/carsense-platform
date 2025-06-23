import type { Hono } from "hono";
import type { PinoLogger } from "hono-pino";

export type AppBindings = {
  Bindings: {
    ASSETS: Fetcher;
    R2_BUCKET: R2Bucket;
    R2_PUBLIC_URL: string;
    R2_DEV_PUBLIC_URL?: string;
  };
  Variables: {
    logger: PinoLogger;
  };
};

export type AppOpenApi = Hono<AppBindings>;
