import { Hono } from "hono";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";

import type { AppBindings } from "./types";

import { pinoLogger } from "../middleware/pino-logger";

export function createApp() {
  const app = new Hono<AppBindings>(
    // { strict: false }
  )
    .use(serveEmojiFavicon("😡"))
    .use(requestId())
    .use(pinoLogger())
    .use(cors({
      origin: ["http://localhost:5173"],
      credentials: true,
    }))
    .notFound(notFound)
    .onError(onError);

  return app;
}
