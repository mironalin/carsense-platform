import type { Hono } from "hono";
import type { PinoLogger } from "hono-pino";

export type AppBindings = {
  Bindings: {
    ASSETS: any; // Cloudflare Workers Fetcher type
    R2_BUCKET: any; // Cloudflare Workers R2Bucket type
    R2_PUBLIC_URL: string;
    R2_DEV_PUBLIC_URL?: string;
  };
  Variables: {
    logger: PinoLogger;
  };
};

export type AppOpenApi = Hono<AppBindings>;
