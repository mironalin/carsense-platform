import { Hono } from "hono";
import { getSessionAndUser } from "../middleware/get-session-and-user";
import {
  selectVehicleSchema,
  vehiclesTable,
} from "../db/schema/vehicles-schema";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";

import { config } from "dotenv";
config({ path: ".env" });

export const vehiclesRoute = new Hono().use(getSessionAndUser).get(
  "/",
  describeRoute({
    description:
      "Get all vehicles owned by the user if the user has the role of 'user', otherwise get all vehicles if the user has the role of 'admin'",
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: resolver(selectVehicleSchema),
          },
        },
      },
      401: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "string" },
              },
              required: ["error"],
            },
          },
        },
      },
    },
  }),
  async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const vehicles = await db
      .select()
      .from(vehiclesTable)
      .where(
        user.role === "user" ? eq(vehiclesTable.ownerId, user.id) : undefined,
      );

    return c.json(vehicles);
  },
);
