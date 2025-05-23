import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver, validator as zValidator } from "hono-openapi/zod";

import type { AppBindings } from "../lib/types";

import { db } from "../db";
import { DTCLibraryTable } from "../db/schema/dtc-library-schema";
import { getSessionAndUser } from "../middleware/get-session-and-user";
import { notFoundResponseObject, unauthorizedResponseObject } from "../zod/z-api-responses";
import { zDTCLibraryResponseSchema, zDTCQuerySchema } from "../zod/z-dtc";

export const dtcRoute = new Hono<AppBindings>()
  .use(getSessionAndUser)
  .get("/", describeRoute({
    tags: ["DTC"],
    summary: "Get DTC by code",
    description: "Get a diagnostic trouble code by its code identifier",
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: resolver(zDTCLibraryResponseSchema),
          },
        },
      },
      404: notFoundResponseObject,
      401: unauthorizedResponseObject,
    },
  }), zValidator("query", zDTCQuerySchema), async (c) => {
    const user = c.get("user");
    const logger = c.get("logger");

    if (!user) {
      logger.warn("Unauthorized access attempt - DTC lookup");
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { code } = c.req.valid("query");

    logger.debug({ code }, "Looking up DTC code");

    const dtc = await db
      .select()
      .from(DTCLibraryTable)
      .where(eq(DTCLibraryTable.code, code))
      .then(res => res[0]);

    if (!dtc) {
      logger.warn({ code }, "DTC code not found");
      return c.json({ error: "DTC code not found" }, 404);
    }

    logger.debug({ code, dtcId: dtc.id }, "DTC code found");
    return c.json(dtc);
  });
