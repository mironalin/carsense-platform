import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver, validator as zValidator } from "hono-openapi/zod";
import { z } from "zod";

import type { AppBindings } from "../lib/types";

import { db } from "../db";
import { insertLocationSchema, locationsTable } from "../db/schema/locations-schema";
import { vehiclesTable } from "../db/schema/vehicles-schema";
import { getSessionAndUser } from "../middleware/get-session-and-user";
import { badRequestResponseObject, notFoundResponseObject, unauthorizedResponseObject } from "../zod/z-api-responses";
import { zLocationGetResponseSchema, zLocationInsertSchema, zLocationsListResponseSchema } from "../zod/z-locations";

const MAX_LOCATIONS_LIMIT = 100;

export const locationsRoute = new Hono<AppBindings>()
  .use(getSessionAndUser)
  .get("/", describeRoute({
    tags: ["Locations"],
    description: "Get all locations for the user's vehicles if the user has the role of 'user', otherwise get all locations if the user has the role of 'admin'",
    summary: "Get all locations",
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: resolver(zLocationsListResponseSchema),
          },
        },
      },
      401: unauthorizedResponseObject,
    },
  }), async (c) => {
    const user = c.get("user");
    const logger = c.get("logger");

    if (!user) {
      logger.warn("Unauthorized access attempt - locations list");
      return c.json({ error: "Unauthorized" }, 401);
    }

    logger.debug({ userId: user.id, role: user.role }, "Fetching locations");

    if (user.role === "user") {
      const userVehicleIds = await db
        .select({ uuid: vehiclesTable.uuid })
        .from(vehiclesTable)
        .where(eq(vehiclesTable.ownerId, user.id));

      const locations = await db
        .select()
        .from(locationsTable)
        .where(
          inArray(
            locationsTable.vehicleUUID,
            userVehicleIds.map(v => v.uuid),
          ),
        );

      if (locations.length > 0) {
        logger.debug({ count: locations.length }, "Locations found");
      }

      return c.json(locations);
    }

    // For admin users
    const locations = await db
      .select()
      .from(locationsTable);

    if (locations.length > 0) {
      logger.debug({ count: locations.length }, "Locations found");
    }

    return c.json(locations);
  })
  .get("/recent", describeRoute({
    tags: ["Locations"],
    description: "Get the latest N locations for each vehicle. If user role is 'user', only returns locations for their vehicles. If user role is 'admin', returns locations for all vehicles. Optionally specify how many locations to retrieve per vehicle (default: 10, max: 100).",
    summary: "Get latest locations per vehicle",
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: resolver(zLocationsListResponseSchema),
          },
        },
      },
      401: unauthorizedResponseObject,
      400: badRequestResponseObject,
    },
  }), zValidator("query", z.object({
    limit: z.string()
      .optional()
      .transform(val => val ? Number.parseInt(val, 10) : 10)
      .pipe(z.number().min(1).max(MAX_LOCATIONS_LIMIT)),
  })), async (c) => {
    const user = c.get("user");
    const logger = c.get("logger");

    if (!user) {
      logger.warn("Unauthorized access attempt - recent locations");
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { limit } = c.req.valid("query");

    logger.debug({ userId: user.id, role: user.role, limit }, "Fetching recent locations per vehicle");

    if (user.role === "user") {
      const userVehicleIds = await db
        .select({ uuid: vehiclesTable.uuid })
        .from(vehiclesTable)
        .where(eq(vehiclesTable.ownerId, user.id));

      // Get the latest N locations for each vehicle
      const locations = await db
        .select()
        .from(locationsTable)
        .where(
          and(
            inArray(
              locationsTable.vehicleUUID,
              userVehicleIds.map(v => v.uuid),
            ),
            sql`${locationsTable.id} IN (
              SELECT id FROM (
                SELECT id, ROW_NUMBER() OVER (PARTITION BY vehicle_id ORDER BY "createdAt" DESC) as rn
                FROM locations
                WHERE vehicle_uuid = ${locationsTable.vehicleUUID}
              ) ranked
              WHERE rn <= ${limit}
            )`,
          ),
        )
        .orderBy(locationsTable.vehicleUUID, desc(locationsTable.createdAt));

      if (locations.length > 0) {
        logger.debug({ count: locations.length }, "Recent locations found");
      }

      return c.json(locations);
    }

    // For admin users
    // Get the latest N locations for each vehicle
    const locations = await db
      .select()
      .from(locationsTable)
      .where(
        sql`${locationsTable.id} IN (
          SELECT id FROM (
            SELECT id, ROW_NUMBER() OVER (PARTITION BY vehicle_id ORDER BY "createdAt" DESC) as rn
            FROM locations
            WHERE vehicle_uuid = ${locationsTable.vehicleUUID}
          ) ranked
          WHERE rn <= ${limit}
        )`,
      )
      .orderBy(locationsTable.vehicleUUID, desc(locationsTable.createdAt));

    if (locations.length > 0) {
      logger.debug({ count: locations.length }, "Recent locations found");
    }

    return c.json(locations);
  })
  .get("/:locationUUID", describeRoute({
    tags: ["Locations"],
    description: "Get a location by UUID. If user role is 'user', they can only access locations for their own vehicles.",
    summary: "Get a location by UUID",
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: resolver(zLocationGetResponseSchema),
          },
        },
      },
      401: unauthorizedResponseObject,
      404: notFoundResponseObject,
    },
  }), zValidator("param", z.object({
    locationUUID: z.string().uuid(),
  })), async (c) => {
    const user = c.get("user");
    const logger = c.get("logger");

    if (!user) {
      logger.warn("Unauthorized access attempt - location details");
      return c.json({ error: "Unauthorized" }, 401);
    }

    const locationUUID = c.req.param("locationUUID");

    logger.debug({ locationUUID }, "Location detail request");

    // If user role is 'user', verify they own the vehicle
    if (user.role === "user") {
      const location = await db
        .select()
        .from(locationsTable)
        .where(eq(locationsTable.uuid, locationUUID))
        .then(res => res[0]);

      if (!location) {
        logger.debug({ locationUUID }, "Location not found");
        return c.json({ error: "Location not found" }, 404);
      }

      if (location.vehicleUUID) {
        const vehicle = await db
          .select()
          .from(vehiclesTable)
          .where(
            and(
              eq(vehiclesTable.uuid, location.vehicleUUID),
              eq(vehiclesTable.ownerId, user.id),
            ),
          )
          .then(res => res[0]);

        if (!vehicle) {
          logger.warn({
            userId: user.id,
            locationId: location.id,
            vehicleUUID: location.vehicleUUID,
          }, "Access denied to location details");
          return c.json({ error: "Unauthorized" }, 401);
        }
      }

      return c.json(location);
    }

    // For admin users
    const location = await db
      .select()
      .from(locationsTable)
      .where(eq(locationsTable.uuid, locationUUID))
      .then(res => res[0]);

    if (!location) {
      logger.debug({ locationUUID }, "Location not found");
      return c.json({ error: "Location not found" }, 404);
    }

    return c.json(location);
  })
  .post("/", describeRoute({
    tags: ["Locations"],
    description: "Create a new location for a vehicle. If user role is 'user', they can only create locations for their own vehicles.",
    summary: "Create a new location",
    responses: {
      201: {
        description: "Created",
        content: {
          "application/json": {
            schema: resolver(zLocationGetResponseSchema),
          },
        },
      },
      401: unauthorizedResponseObject,
    },
  }), zValidator("json", zLocationInsertSchema), async (c) => {
    const user = c.get("user");
    const logger = c.get("logger");

    if (!user) {
      logger.warn("Unauthorized location creation attempt");
      return c.json({ error: "Unauthorized" }, 401);
    }

    const location = c.req.valid("json");

    logger.debug({ vehicleUUID: location.vehicleUUID }, "Location creation requested");

    if (user.role === "user" && location.vehicleUUID) {
      const vehicle = await db
        .select()
        .from(vehiclesTable)
        .where(
          and(
            eq(vehiclesTable.uuid, location.vehicleUUID),
            eq(vehiclesTable.ownerId, user.id),
          ),
        )
        .then(res => res[0]);

      if (!vehicle) {
        logger.warn("User not authorized to create location for this vehicle");
        return c.json({ error: "Unauthorized to create location for this vehicle" }, 401);
      }
    }

    const validatedLocation = insertLocationSchema.parse({
      ...location,
    });

    const newLocation = await db
      .insert(locationsTable)
      .values(validatedLocation)
      .returning()
      .then(res => res[0]);

    c.status(201);

    logger.info({ uuid: newLocation.uuid, vehicleUUID: newLocation.vehicleUUID }, "Location created");

    return c.json(newLocation);
  });
