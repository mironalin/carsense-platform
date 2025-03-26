import { Hono } from "hono";
import { requestId } from "hono/request-id";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";

import type { AppBindings } from "@/lib/types";

import { pinoLogger } from "@/middleware/pino-logger";

export function createApp() {
  const app = new Hono<AppBindings>(
    // { strict: false }
  )
    .use(serveEmojiFavicon("😡"))
    .use(requestId())
    .use(pinoLogger())
    .notFound(notFound)
    .onError(onError);

  return app;
}
