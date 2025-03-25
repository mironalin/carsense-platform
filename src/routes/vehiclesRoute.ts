import { Hono } from "hono";
import { getSessionAndUser } from "../middleware/get-session-and-user";
import {
  insertVehicleSchema,
  selectVehicleSchema,
  updateVehicleSchema,
  vehiclesTable,
} from "../db/schema/vehicles-schema";
import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "../db";
import { describeRoute } from "hono-openapi";
import { resolver, validator as zValidator } from "hono-openapi/zod";

import { config } from "dotenv";
import { zVehicleInsertSchema } from "../zod/zVehicles";
import { z } from "zod";
import {
  insertOwnershipTransferSchema,
  ownershipTransfersTable,
} from "../db/schema/ownership-transfers";
config({ path: ".env" });

export const vehiclesRoute = new Hono()
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
                  error: { type: "string", example: "Unauthorized" },
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
          and(
            user.role === "user"
              ? eq(vehiclesTable.ownerId, user.id)
              : undefined,
            isNull(vehiclesTable.deletedAt),
          ),
        );

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

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const vehicle = c.req.valid("json");

      const existing = await db
        .select()
        .from(vehiclesTable)
        .where(eq(vehiclesTable.vin, vehicle.vin));

      const deletedVehicle = existing.find((v) => v.deletedAt !== null);

      // console.log(deletedVehicle);

      if (deletedVehicle) {
        if (deletedVehicle.ownerId !== user.id) {
          // Log ownership transfer
          const ownershipTransfer = insertOwnershipTransferSchema.parse({
            vehicleId: deletedVehicle.id,
            fromUserId: deletedVehicle.ownerId,
            toUserId: user.id,
            transferredAt: new Date(),
          });

          await db.insert(ownershipTransfersTable).values(ownershipTransfer);

          console.log("Ownership transfer logged");
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
          .then((res) => res[0]);

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
        .then((res) => res[0]);

      c.status(201);

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
              schema: resolver(selectVehicleSchema),
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
          404: {
            description: "Vehicle not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string", example: "Vehicle not found" },
                  },
                  required: ["error"],
                },
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

      const uuid = c.req.param("vehicleUUID");

      const vehicle = await db
        .select()
        .from(vehiclesTable)
        .where(eq(vehiclesTable.uuid, uuid))
        .then((res) => res[0]);

      if (!vehicle) {
        return c.json({ error: "Vehicle not found" }, 404);
      }

      if (user.role !== "admin" && vehicle.ownerId !== user.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

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
                  error: { type: "string", example: "Unauthorized" },
                },
                required: ["error"],
              },
            },
          },
        },
        404: {
          description: "Vehicle not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Vehicle not found" },
                },
                required: ["error"],
              },
            },
          },
        },
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

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const vehicleBody = c.req.valid("json");

      const vehicleUUID = c.req.param("vehicleUUID");

      const vehicle = await db
        .select()
        .from(vehiclesTable)
        .where(eq(vehiclesTable.uuid, vehicleUUID))
        .then((res) => res[0]);

      if (!vehicle) {
        return c.json({ error: "Vehicle not found" }, 404);
      }

      if (user.role !== "admin" && vehicle.ownerId !== user.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // If ownerId is being updated, log transfer
      if (vehicleBody.ownerId && vehicleBody.ownerId !== vehicle.ownerId) {
        if (user.role !== "admin") {
          return c.json({ error: "Only admins can transfer ownership" }, 403);
        }

        const ownershipTransfer = insertOwnershipTransferSchema.parse({
          vin: vehicle.vin,
          fromUserId: vehicle.ownerId,
          toUserId: vehicleBody.ownerId,
          transferredAt: new Date(),
        });

        await db.insert(ownershipTransfersTable).values(ownershipTransfer);
      }

      const validatedVehicleUpdate = updateVehicleSchema.parse({
        ...vehicleBody,
      });

      console.log("Validated updated vehicle: ", validatedVehicleUpdate);

      const updatedVehicle = await db
        .update(vehiclesTable)
        .set(validatedVehicleUpdate)
        .where(eq(vehiclesTable.uuid, vehicleUUID))
        .returning()
        .then((res) => res[0]);

      return c.json(updatedVehicle);
    },
  )
  .delete(
    "/:vehicleUUID",
    describeRoute({
      description: "Delete a vehicle",
      summary: "Delete a vehicle",
      tags: ["Vehicles"],
      parameters: [
        {
          name: "vehicleUUID",
          in: "path",
          description: "UUID of the vehicle to delete",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Vehicle deleted",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Vehicle soft deleted successfully",
                  },
                  vehicleUUID: {
                    type: "string",
                    example: "123e4567-e89b-12d3-a456-426614174000",
                  },
                },
              },
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
                  error: {
                    type: "string",
                    example: "Unauthorized",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Vehicle not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Vehicle not found",
                  },
                },
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

      const vehicleUUID = c.req.param("vehicleUUID");

      const vehicle = await db
        .select()
        .from(vehiclesTable)
        .where(eq(vehiclesTable.uuid, vehicleUUID))
        .then((res) => res[0]);

      if (!vehicle) {
        return c.json({ error: "Vehicle not found" }, 404);
      }

      if (vehicle.ownerId !== user.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const softDeleteVehicle = updateVehicleSchema.parse({
        deletedAt: new Date(),
      });

      await db.update(vehiclesTable).set(softDeleteVehicle);

      return c.json({
        message: "Vehicle soft deleted successfully",
        vehicleUUID: vehicle.uuid,
      });
    },
  );
