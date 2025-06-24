import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";

import { zCreateMaintenanceEntrySchema, zDeleteMaintenanceEntryResponseSchema, zMaintenanceEntryResponseSchema, zMaintenanceHistoryResponseSchema } from "@/zod/z-maintenance";

import type { AppBindings } from "../lib/types";

import { db } from "../db";
import {
  maintenanceLogTable,
} from "../db/schema/maintenance-log-schema";
import {
  maintenanceLogServicesTable,
} from "../db/schema/maintenance-log-services-schema";
import { serviceWorkshopsTable } from "../db/schema/service-workshops-schema";
import { vehiclesTable } from "../db/schema/vehicles-schema";
import { getSessionAndUser } from "../middleware/get-session-and-user";
import {
  badRequestResponseObject,
  notFoundResponseObject,
  unauthorizedResponseObject,
} from "../zod/z-api-responses";

export const maintenanceRoute = new Hono<AppBindings>()
  .use(getSessionAndUser)

  // Create a maintenance entry
  .post(
    "/",
    describeRoute({
      tags: ["Maintenance"],
      description: "Create a new maintenance entry for a vehicle with multiple service types",
      summary: "Create maintenance entry",

      responses: {
        201: {
          description: "Maintenance entry created",
          content: {
            "application/json": {
              schema: resolver(zMaintenanceEntryResponseSchema),
            },
          },
        },
        400: badRequestResponseObject,
        401: unauthorizedResponseObject,
        404: notFoundResponseObject,
      },
    }),
    async (c) => {
      const currentUser = c.get("user");
      const logger = c.get("logger");

      if (!currentUser) {
        logger.warn("Unauthorized maintenance entry creation");
        return c.json({ error: "Unauthorized" }, 401);
      }

      const requestData = zCreateMaintenanceEntrySchema.parse(await c.req.json());

      logger.info({
        vehicleUUID: requestData.vehicleUUID,
        serviceTypes: requestData.serviceTypes,
        userId: currentUser.id,
        cost: requestData.cost,
      }, "Creating maintenance entry");

      // Check if the vehicle belongs to the current user
      const vehicle = await db
        .select()
        .from(vehiclesTable)
        .where(
          and(
            eq(vehiclesTable.uuid, requestData.vehicleUUID),
            eq(vehiclesTable.ownerId, currentUser.id),
            isNull(vehiclesTable.deletedAt),
          ),
        )
        .then(res => res[0]);

      if (!vehicle) {
        logger.warn({
          vehicleUUID: requestData.vehicleUUID,
          userId: currentUser.id,
          serviceTypes: requestData.serviceTypes,
        }, "Vehicle not found or not owned by user");

        return c.json(
          { error: "Vehicle not found or you don't have permission to add maintenance records" },
          404,
        );
      }

      // Handle workshop UUID - either existing workshop or create a new one
      let serviceWorkshopUUID = requestData.serviceWorkshopUUID;

      if (!serviceWorkshopUUID && requestData.customServiceWorkshopName) {
        // Create a new workshop
        const defaultWorkshop = await db
          .insert(serviceWorkshopsTable)
          .values({
            name: requestData.customServiceWorkshopName,
            latitude: 0, // Default values - these could be updated with location if provided
            longitude: 0,
          })
          .returning()
          .then(res => res[0]);
        serviceWorkshopUUID = defaultWorkshop.uuid;
      }
      else if (!serviceWorkshopUUID && !requestData.customServiceWorkshopName) {
        return c.json({ error: "Either serviceWorkshopUUID or customServiceWorkshopName must be provided" }, 400);
      }

      // Ensure serviceWorkshopUUID is defined
      if (!serviceWorkshopUUID) {
        return c.json({ error: "Failed to determine workshop UUID" }, 500);
      }

      // Create the maintenance entry without serviceType field
      const maintenanceEntry = {
        vehicleUUID: requestData.vehicleUUID,
        serviceWorkshopUUID,
        customServiceWorkshopName: requestData.customServiceWorkshopName,
        serviceDate: new Date(requestData.serviceDate),
        odometer: requestData.odometer,
        cost: requestData.cost,
        notes: requestData.notes,
      };

      // Create the maintenance entry
      const createdEntry = await db
        .insert(maintenanceLogTable)
        .values(maintenanceEntry)
        .returning()
        .then(res => res[0]);

      // Create the service type associations
      const serviceTypeEntries = requestData.serviceTypes.map((serviceType: any) => ({
        maintenanceLogUUID: createdEntry.uuid,
        serviceType,
      }));

      await db
        .insert(maintenanceLogServicesTable)
        .values(serviceTypeEntries);

      logger.info({
        maintenanceUUID: createdEntry.uuid,
        vehicleUUID: requestData.vehicleUUID,
        serviceTypes: requestData.serviceTypes,
        userId: currentUser.id,
      }, "Maintenance entry created");

      c.status(201);
      return c.json({
        maintenanceEntry: createdEntry,
        message: "Maintenance entry created successfully",
      });
    },
  )

  // Get maintenance history for a vehicle
  .get(
    "/:vehicleUUID",
    describeRoute({
      tags: ["Maintenance"],
      description: "Get maintenance history for a specific vehicle",
      summary: "Get maintenance history",
      responses: {
        200: {
          description: "Maintenance history retrieved",
          content: {
            "application/json": {
              schema: resolver(zMaintenanceHistoryResponseSchema),
            },
          },
        },
        401: unauthorizedResponseObject,
        404: notFoundResponseObject,
      },
    }),
    async (c) => {
      const currentUser = c.get("user");
      const logger = c.get("logger");

      if (!currentUser) {
        logger.warn("Unauthorized maintenance history access");
        return c.json({ error: "Unauthorized" }, 401);
      }

      const vehicleUUID = c.req.param("vehicleUUID");

      // Verify vehicle ownership
      const vehicle = await db
        .select()
        .from(vehiclesTable)
        .where(
          and(
            eq(vehiclesTable.uuid, vehicleUUID),
            eq(vehiclesTable.ownerId, currentUser.id),
            isNull(vehiclesTable.deletedAt),
          ),
        )
        .then(res => res[0]);

      if (!vehicle) {
        logger.warn({ userId: currentUser.id, vehicleUUID }, "Vehicle not found or not owned");
        return c.json({ error: "Vehicle not found or you don't own this vehicle" }, 404);
      }

      // Get maintenance history with workshop information and service types
      const maintenanceEntries = await db
        .select({
          // Select all maintenance fields
          uuid: maintenanceLogTable.uuid,
          vehicleUUID: maintenanceLogTable.vehicleUUID,
          serviceWorkshopUUID: maintenanceLogTable.serviceWorkshopUUID,
          customServiceWorkshopName: maintenanceLogTable.customServiceWorkshopName,
          serviceDate: maintenanceLogTable.serviceDate,
          odometer: maintenanceLogTable.odometer,
          cost: maintenanceLogTable.cost,
          notes: maintenanceLogTable.notes,
          createdAt: maintenanceLogTable.createdAt,
          updatedAt: maintenanceLogTable.updatedAt,
          // Select workshop fields
          workshopUuid: serviceWorkshopsTable.uuid,
          workshopName: serviceWorkshopsTable.name,
          workshopPhone: serviceWorkshopsTable.phone,
          workshopEmail: serviceWorkshopsTable.email,
          workshopWebsite: serviceWorkshopsTable.website,
        })
        .from(maintenanceLogTable)
        .leftJoin(
          serviceWorkshopsTable,
          eq(maintenanceLogTable.serviceWorkshopUUID, serviceWorkshopsTable.uuid),
        )
        .where(eq(maintenanceLogTable.vehicleUUID, vehicleUUID))
        .orderBy(desc(maintenanceLogTable.serviceDate));

      // Get service types for all maintenance entries
      const maintenanceUUIDs = maintenanceEntries.map(entry => entry.uuid);
      const serviceTypes = maintenanceUUIDs.length > 0
        ? await db
          .select({
            maintenanceLogUUID: maintenanceLogServicesTable.maintenanceLogUUID,
            serviceType: maintenanceLogServicesTable.serviceType,
          })
          .from(maintenanceLogServicesTable)
          .where(inArray(maintenanceLogServicesTable.maintenanceLogUUID, maintenanceUUIDs))
        : [];

      // Group service types by maintenance entry UUID
      const serviceTypesByEntry: Record<string, string[]> = {};
      serviceTypes.forEach((st) => {
        if (!serviceTypesByEntry[st.maintenanceLogUUID]) {
          serviceTypesByEntry[st.maintenanceLogUUID] = [];
        }
        serviceTypesByEntry[st.maintenanceLogUUID].push(st.serviceType);
      });

      // Build maintenance history with service types
      const maintenanceHistory = maintenanceEntries.map(entry => ({
        uuid: entry.uuid,
        vehicleUUID: entry.vehicleUUID,
        serviceWorkshopUUID: entry.serviceWorkshopUUID,
        customServiceWorkshopName: entry.customServiceWorkshopName,
        serviceDate: entry.serviceDate,
        serviceTypes: serviceTypesByEntry[entry.uuid] || [],
        odometer: entry.odometer,
        cost: entry.cost,
        notes: entry.notes,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
        workshop: entry.workshopUuid
          ? {
              uuid: entry.workshopUuid,
              name: entry.workshopName,
              phone: entry.workshopPhone,
              email: entry.workshopEmail,
              website: entry.workshopWebsite,
            }
          : null,
      }));

      // Calculate summary statistics on the backend
      const totalEntries = maintenanceHistory.length;
      const totalCost = maintenanceHistory.reduce((sum, entry) => sum + (entry.cost || 0), 0);

      // Calculate service type counts (counting all service types across all entries)
      const serviceTypeCounts: Record<string, number> = {};
      maintenanceHistory.forEach((entry) => {
        entry.serviceTypes.forEach((serviceType) => {
          serviceTypeCounts[serviceType] = (serviceTypeCounts[serviceType] || 0) + 1;
        });
      });

      // Find most common service
      const mostCommonServiceEntry = Object.entries(serviceTypeCounts)
        .sort(([, a], [, b]) => b - a)[0];

      const mostCommonService = mostCommonServiceEntry
        ? { type: mostCommonServiceEntry[0], count: mostCommonServiceEntry[1] }
        : null;

      // Get last service (already ordered by date desc)
      const lastService = maintenanceHistory[0] || null;

      const summary = {
        totalEntries,
        totalCost,
        serviceTypeCounts,
        mostCommonService,
        lastService: lastService
          ? {
              uuid: lastService.uuid,
              serviceDate: lastService.serviceDate,
              serviceTypes: lastService.serviceTypes,
              cost: lastService.cost,
            }
          : null,
      };

      logger.info({
        vehicleUUID,
        userId: currentUser.id,
        entriesCount: maintenanceHistory.length,
        totalCost,
      }, "Maintenance history and summary retrieved");

      return c.json({
        maintenanceHistory,
        summary,
        vehicleInfo: {
          uuid: vehicle.uuid,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          licensePlate: vehicle.licensePlate,
        },
      });
    },
  )

  // Delete a maintenance entry
  .delete(
    "/:maintenanceUUID",
    describeRoute({
      tags: ["Maintenance"],
      description: "Delete a maintenance entry and its associated service types",
      summary: "Delete maintenance entry",
      responses: {
        200: {
          description: "Maintenance entry deleted successfully",
          content: {
            "application/json": {
              schema: resolver(zDeleteMaintenanceEntryResponseSchema),
            },
          },
        },
        401: unauthorizedResponseObject,
        404: notFoundResponseObject,
      },
    }),
    async (c) => {
      const currentUser = c.get("user");
      const logger = c.get("logger");

      if (!currentUser) {
        logger.warn("Unauthorized maintenance entry deletion");
        return c.json({ error: "Unauthorized" }, 401);
      }

      const maintenanceUUID = c.req.param("maintenanceUUID");

      // First, get the maintenance entry and verify ownership through vehicle
      const maintenanceEntry = await db
        .select({
          uuid: maintenanceLogTable.uuid,
          vehicleUUID: maintenanceLogTable.vehicleUUID,
          ownerId: vehiclesTable.ownerId,
        })
        .from(maintenanceLogTable)
        .innerJoin(vehiclesTable, eq(maintenanceLogTable.vehicleUUID, vehiclesTable.uuid))
        .where(
          and(
            eq(maintenanceLogTable.uuid, maintenanceUUID),
            eq(vehiclesTable.ownerId, currentUser.id),
            isNull(vehiclesTable.deletedAt),
          ),
        )
        .then(res => res[0]);

      if (!maintenanceEntry) {
        logger.warn({
          maintenanceUUID,
          userId: currentUser.id,
        }, "Maintenance entry not found or not owned by user");

        return c.json(
          { error: "Maintenance entry not found or you don't have permission to delete it" },
          404,
        );
      }

      // Delete associated service types first (foreign key constraint)
      await db
        .delete(maintenanceLogServicesTable)
        .where(eq(maintenanceLogServicesTable.maintenanceLogUUID, maintenanceUUID));

      // Delete the maintenance entry
      await db
        .delete(maintenanceLogTable)
        .where(eq(maintenanceLogTable.uuid, maintenanceUUID));

      logger.info({
        maintenanceUUID,
        vehicleUUID: maintenanceEntry.vehicleUUID,
        userId: currentUser.id,
      }, "Maintenance entry and associated service types deleted");

      return c.json({
        message: "Maintenance entry deleted successfully",
      });
    },
  );
