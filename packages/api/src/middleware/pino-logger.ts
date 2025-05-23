import { pinoLogger as honoLogger } from "hono-pino";
import pino from "pino";
import pretty from "pino-pretty";

import env from "../../env";

export function pinoLogger() {
  const logger = pino({
    level: env.LOG_LEVEL || "info",
  }, env.NODE_ENV === "production" ? undefined : pretty());

  return honoLogger({
    pino: logger,
  });
}
