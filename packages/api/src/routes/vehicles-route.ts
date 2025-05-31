import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver, validator as zValidator } from "hono-openapi/zod";
import { z } from "zod";

import type { AppBindings } from "../lib/types";

import { db } from "../db";
import { diagnosticsTable } from "../db/schema/diagnostics-schema";
import { locationsTable } from "../db/schema/locations-schema";
import {
  insertOwnershipTransferSchema,
  ownershipTransfersTable,
} from "../db/schema/ownership-transfers";
import {
  insertVehicleSchema,
  updateVehicleSchema,
  vehiclesTable,
} from "../db/schema/vehicles-schema";
import { getSessionAndUser } from "../middleware/get-session-and-user";
import { badRequestResponseObject, notFoundResponseObject, unauthorizedResponseObject, vehicleNotFoundResponseObject } from "../zod/z-api-responses";
import { zLocationsListResponseSchema } from "../zod/z-locations";
import {
  zVehicleCreateResponseSchema,
  zVehicleDeleteResponseSchema,
  zVehicleGetResponseSchema,
  zVehicleInsertSchema,
  zVehicleRestoreResponseSchema,
  zVehicleUpdateResponseSchema,
  zVehiclesListResponseSchema,
} from "../zod/z-vehicles";

const MAX_LOCATIONS_LIMIT = 100;

export const vehiclesRoute = new Hono<AppBindings>()
  .use(getSessionAndUser)
  .get(
    "/",
    describeRoute({
      tags: ["Vehicles"],
      description:
        "Get all vehicles owned by the user if the user has the role of 'user', otherwise get all vehicles if the user has the role of 'admin'",
      summary: "Get all vehicles",
      responses: {
        200: {
          description: "OK",
          content: {
            "application/json": {
              schema: resolver(zVehiclesListResponseSchema),
            },
          },
        },
        401: unauthorizedResponseObject,
      },
    }),
    async (c) => {
      const user = c.get("user");
      const logger = c.get("logger");

      if (!user) {
        logger.warn("Unauthorized access attempt - vehicles list");
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Only log essential information and at lower levels for frequent operations
      logger.debug({ userId: user.id, role: user.role }, "Fetching vehicles");

      const vehicles = await db
        .select()
        .from(vehiclesTable)
        .where(
          user.role === "user"
            ? and(
                eq(vehiclesTable.ownerId, user.id),
                isNull(vehiclesTable.deletedAt),
              )
            : undefined,
        );

      // Only log count, not the entire response
      if (vehicles.length > 0) {
        logger.debug({ count: vehicles.length }, "Vehicles found");
      }

      return c.json(vehicles);
    },
  )
  .post(
    "/",
    describeRoute({
      tags: ["Vehicles"],
      description: "Create a new vehicle for the authenticated user",
      summary: "Create a new vehicle",
      responses: {
        201: {
          description: "Created",
          content: {
            "application/json": {
              schema: resolver(zVehicleCreateResponseSchema),
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
                  error: { type: "string", example: "Unauthorized" },
                },
                required: ["error"],
              },
            },
          },
        },
      },
    }),
    zValidator("json", zVehicleInsertSchema),
    async (c) => {
      const user = c.get("user");
      const logger = c.get("logger");

      if (!user) {
        logger.warn("Unauthorized vehicle creation attempt");
        return c.json({ error: "Unauthorized" }, 401);
      }

      const vehicle = c.req.valid("json");

      // Log only minimal data on creation attempt - VIN is a unique identifier
      logger.debug({ vin: vehicle.vin }, "Vehicle creation requested");

      const existing = await db
        .select()
        .from(vehiclesTable)
        .where(eq(vehiclesTable.vin, vehicle.vin));

      const deletedVehicle = existing.find(v => v.deletedAt !== null);

      if (deletedVehicle) {
        // This is an unusual flow, so logging at info level is appropriate
        logger.info({ vin: vehicle.vin }, "Restoring previously deleted vehicle");

        if (deletedVehicle.ownerId !== user.id) {
          // Ownership transfer is important to log
          const ownershipTransfer = insertOwnershipTransferSchema.parse({
            vehicleId: deletedVehicle.id,
            fromUserId: deletedVehicle.ownerId,
            toUserId: user.id,
            transferredAt: new Date(),
          });

          await db.insert(ownershipTransfersTable).values(ownershipTransfer);

          logger.info({
            fromUserId: deletedVehicle.ownerId,
            toUserId: user.id,
          }, "Ownership transferred");
        }

        // Reactivate and reassign
        const updatedVehicle = updateVehicleSchema.parse({
          ...deletedVehicle,
          ownerId: user.id,
          deletedAt: null,
          updatedAt: new Date(),
        });

        const updated = await db
          .update(vehiclesTable)
          .set(updatedVehicle)
          .where(eq(vehiclesTable.id, deletedVehicle.id))
          .returning()
          .then(res => res[0]);

        return c.json({ vehicle: updated, restored: true });
      }

      const validatedVehicle = insertVehicleSchema.parse({
        ...vehicle,
        ownerId: user.id,
      });

      const created = await db
        .insert(vehiclesTable)
        .values(validatedVehicle)
        .returning()
        .then(res => res[0]);

      c.status(201);

      // Log success with minimal data
      logger.info({ id: created.id, vin: created.vin }, "Vehicle created");
      return c.json({ vehicle: created, created: true });
    },
  )
  .get(
    "/:vehicleUUID",
    describeRoute({
      tags: ["Vehicles"],
      description: "Get a vehicle by UUID",
      summary: "Get a vehicle by UUID",
      responses: {
        200: {
          description: "Vehicle found",
          content: {
            "application/json": {
              schema: resolver(zVehicleGetResponseSchema),
            },
          },
        },
        401: unauthorizedResponseObject,
        404: vehicleNotFoundResponseObject,
      },
    }),
    async (c) => {
      const user = c.get("user");
      const logger = c.get("logger");
      const uuid = c.req.param("vehicleUUID");

      if (!user) {
        logger.warn("Unauthorized vehicle detail access");
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Use debug level for routine operations
      logger.debug({ uuid }, "Vehicle detail request");

      const vehicle = await db
        .select()
        .from(vehiclesTable)
        .where(eq(vehiclesTable.uuid, uuid))
        .then(res => res[0]);

      if (!vehicle) {
        // Log not found at debug level - likely just user error
        logger.debug({ uuid }, "Vehicle not found");
        return c.json({ error: "Vehicle not found" }, 404);
      }

      if (user.role !== "admin" && vehicle.ownerId !== user.id) {
        // Log security issues at warn level
        logger.warn({
          userId: user.id,
          vehicleOwnerId: vehicle.ownerId,
        }, "Access denied to vehicle details");
        return c.json({ error: "Unauthorized" }, 401);
      }

      // No need to log successful routine operations
      return c.json(vehicle);
    },
  )
  .patch(
    "/:vehicleUUID",
    describeRoute({
      tags: ["Vehicles"],
      description: "Update a vehicle by UUID",
      summary: "Update a vehicle by UUID",
      responses: {
        200: {
          description: "Vehicle updated",
          content: {
            "application/json": {
              schema: resolver(zVehicleUpdateResponseSchema),
            },
          },
        },
        401: unauthorizedResponseObject,
        404: vehicleNotFoundResponseObject,
      },
    }),
    zValidator(
      "json",
      updateVehicleSchema
        .omit({
          uuid: true,
          createdAt: true,
          updatedAt: true,
        })
        .partial(),
    ),
    async (c) => {
      const user = c.get("user");
      const logger = c.get("logger");

      if (!user) {
        logger.warn("Unauthorized vehicle update attempt");
        return c.json({ error: "Unauthorized" }, 401);
      }

      const vehicleBody = c.req.valid("json");
      const vehicleUUID = c.req.param("vehicleUUID");

      // Debug level for routine operations
      logger.debug({ uuid: vehicleUUID }, "Vehicle update request");

      const vehicle = await db
        .select()
        .from(vehiclesTable)
        .where(eq(vehiclesTable.uuid, vehicleUUID))
        .then(res => res[0]);

      if (!vehicle) {
        logger.debug({ uuid: vehicleUUID }, "Vehicle not found for update");
        return c.json({ error: "Vehicle not found" }, 404);
      }

      if (user.role !== "admin" && vehicle.ownerId !== user.id) {
        // Security concerns get warn level
        logger.warn({
          userId: user.id,
          vehicleOwnerId: vehicle.ownerId,
        }, "Access denied for vehicle update");
        return c.json({ error: "Unauthorized" }, 401);
      }

      // If ownerId is being updated, log transfer - important business event
      if (vehicleBody.ownerId && vehicleBody.ownerId !== vehicle.ownerId) {
        if (user.role !== "admin") {
          logger.warn({
            userId: user.id,
            attemptedOwnerId: vehicleBody.ownerId,
          }, "Non-admin ownership transfer attempt");
          return c.json({ error: "Only admins can transfer ownership" }, 403);
        }

        const ownershipTransfer = insertOwnershipTransferSchema.parse({
          vin: vehicle.vin,
          fromUserId: vehicle.ownerId,
          toUserId: vehicleBody.ownerId,
          transferredAt: new Date(),
        });

        await db.insert(ownershipTransfersTable).values(ownershipTransfer);
        // Important business event - use info level
        logger.info({
          fromUserId: vehicle.ownerId,
          toUserId: vehicleBody.ownerId,
        }, "Vehicle ownership transferred");
      }

      const validatedVehicleUpdate = updateVehicleSchema.parse({
        ...vehicleBody,
      });

      // Don't need to log all updates at a higher level than debug
      const updatedVehicle = await db
        .update(vehiclesTable)
        .set(validatedVehicleUpdate)
        .where(eq(vehiclesTable.uuid, vehicleUUID))
        .returning()
        .then(res => res[0]);

      return c.json(updatedVehicle);
    },
  )
  .delete(
    "/:vehicleUUID",
    describeRoute({
      description: "Delete a vehicle",
      summary: "Delete a vehicle",
      tags: ["Vehicles"],
      responses: {
        200: {
          description: "Vehicle deleted",
          content: {
            "application/json": {
              schema: resolver(zVehicleDeleteResponseSchema),
            },
          },
        },
        401: unauthorizedResponseObject,
        404: vehicleNotFoundResponseObject,
      },
    }),
    async (c) => {
      const user = c.get("user");
      const logger = c.get("logger");

      if (!user) {
        logger.warn("Unauthorized vehicle deletion attempt");
        return c.json({ error: "Unauthorized" }, 401);
      }

      const vehicleUUID = c.req.param("vehicleUUID");
      // Use debug for routine operations
      logger.debug({ uuid: vehicleUUID }, "Vehicle deletion request");

      const vehicle = await db
        .select()
        .from(vehiclesTable)
        .where(eq(vehiclesTable.uuid, vehicleUUID))
        .then(res => res[0]);

      if (!vehicle) {
        logger.debug({ uuid: vehicleUUID }, "Vehicle not found for deletion");
        return c.json({ error: "Vehicle not found" }, 404);
      }

      if (vehicle.ownerId !== user.id) {
        // Security concerns get warn level
        logger.warn({
          userId: user.id,
          vehicleOwnerId: vehicle.ownerId,
        }, "Access denied for vehicle deletion");
        return c.json({ error: "Unauthorized" }, 401);
      }

      const softDeleteVehicle = updateVehicleSchema.parse({
        deletedAt: new Date(),
        updatedAt: new Date(),
      });

      await db.update(vehiclesTable).set(softDeleteVehicle).where(eq(vehiclesTable.uuid, vehicleUUID));

      // Vehicle deletion is significant enough to log at info level
      logger.info({ vin: vehicle.vin }, "Vehicle soft deleted");
      return c.json({
        message: "Vehicle soft deleted successfully",
        vehicleUUID: vehicle.uuid,
      });
    },
  )
  .post("/:vehicleUUID/restore", describeRoute({
    tags: ["Vehicles"],
    description: "Restore a vehicle",
    summary: "Restore a vehicle",
    responses: {
      200: {
        description: "Vehicle restored",
        content: {
          "application/json": {
            schema: resolver(zVehicleRestoreResponseSchema),
          },
        },
      },
      401: unauthorizedResponseObject,
      404: vehicleNotFoundResponseObject,
    },
  }), async (c) => {
    const user = c.get("user");
    const logger = c.get("logger");
    const vehicleUUID = c.req.param("vehicleUUID");

    if (!user) {
      logger.warn("Unauthorized vehicle restore attempt");
      return c.json({ error: "Unauthorized" }, 401);
    }

    logger.debug({ uuid: vehicleUUID }, "Vehicle restore request");

    const vehicle = await db.select().from(vehiclesTable).where(eq(vehiclesTable.uuid, vehicleUUID)).then(res => res[0]);

    if (!vehicle) {
      logger.debug({ uuid: vehicleUUID }, "Vehicle not found for restoration");
      return c.json({ error: "Vehicle not found" }, 404);
    }

    if (vehicle.ownerId !== user.id) {
      // Security concerns get warn level
      logger.warn({
        userId: user.id,
        vehicleOwnerId: vehicle.ownerId,
      }, "Access denied for vehicle restoration");
      return c.json({ error: "Unauthorized" }, 401);
    }

    const restoredVehicleUpdate = updateVehicleSchema.parse({
      deletedAt: null,
      updatedAt: new Date(),
    });

    const restoredVehicle = await db.update(vehiclesTable).set(restoredVehicleUpdate).where(eq(vehiclesTable.uuid, vehicleUUID)).returning().then(res => res[0]);

    // Vehicle restoration is significant enough to log at info level
    logger.info({ vin: restoredVehicle.vin }, "Vehicle restored");
    return c.json({ vehicle: restoredVehicle, restored: true });
  })
  .get("/:vehicleUUID/diagnostics", describeRoute({
    tags: ["Vehicles"],
    description: "Get diagnostics for a vehicle",
    summary: "Get diagnostics for a vehicle",
  }), async (c) => {
    const user = c.get("user");
    const logger = c.get("logger");
    const vehicleUUID = c.req.param("vehicleUUID");

    if (!user) {
      logger.warn("Unauthorized vehicle diagnostics access");
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get the vehicle first to get its ID
    const vehicle = await db.select().from(vehiclesTable).where(eq(vehiclesTable.uuid, vehicleUUID)).then(res => res[0]);

    if (!vehicle) {
      logger.warn("Vehicle not found for diagnostics");
      return c.json({ error: "Vehicle not found" }, 404);
    }

    // Use the numeric ID from the vehicle to query diagnostics
    const diagnostics = await db.select().from(diagnosticsTable).where(eq(diagnosticsTable.vehicleId, vehicle.id));

    return c.json(diagnostics);
  })
  .get("/:vehicleUUID/locations/recent", describeRoute({
    tags: ["Vehicles"],
    description: "Get the latest N locations for a specific vehicle. If user role is 'user', they can only access locations for their own vehicles.",
    summary: "Get recent locations for a vehicle",
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
      404: notFoundResponseObject,
      400: badRequestResponseObject,
    },
  }), zValidator("param", z.object({
    vehicleUUID: z.string().uuid(),
  })), zValidator("query", z.object({
    limit: z.string()
      .optional()
      .transform(val => val ? Number.parseInt(val, 10) : 10)
      .pipe(z.number().min(1).max(MAX_LOCATIONS_LIMIT)),
  })), async (c) => {
    const user = c.get("user");
    const logger = c.get("logger");

    if (!user) {
      logger.warn("Unauthorized access attempt - vehicle recent locations");
      return c.json({ error: "Unauthorized" }, 401);
    }

    const vehicleUUID = c.req.param("vehicleUUID");
    const { limit } = c.req.valid("query");

    logger.debug({ userId: user.id, role: user.role, vehicleUUID, limit }, "Fetching recent locations for vehicle");

    // Get the vehicle first to check ownership
    const vehicle = await db
      .select()
      .from(vehiclesTable)
      .where(eq(vehiclesTable.uuid, vehicleUUID))
      .then(res => res[0]);

    if (!vehicle) {
      logger.debug({ vehicleUUID }, "Vehicle not found");
      return c.json({ error: "Vehicle not found" }, 404);
    }

    // Check ownership for non-admin users
    if (user.role === "user" && vehicle.ownerId !== user.id) {
      logger.warn({
        userId: user.id,
        vehicleId: vehicle.id,
        ownerId: vehicle.ownerId,
      }, "Access denied to vehicle locations");
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get the latest N locations for the vehicle
    const locations = await db
      .select()
      .from(locationsTable)
      .where(
        and(
          eq(locationsTable.vehicleId, vehicle.id),
          sql`${locationsTable.id} IN (
            SELECT id FROM (
              SELECT id, ROW_NUMBER() OVER (ORDER BY "createdAt" DESC) as rn
              FROM locations
              WHERE vehicle_id = ${vehicle.id}
            ) ranked
            WHERE rn <= ${limit}
          )`,
        ),
      )
      .orderBy(desc(locationsTable.createdAt));

    if (locations.length > 0) {
      logger.debug({ count: locations.length }, "Recent locations found");
    }

    return c.json(locations);
  });
