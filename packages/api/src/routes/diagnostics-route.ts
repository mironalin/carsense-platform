import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver, validator as zValidator } from "hono-openapi/zod";
import { z } from "zod";

import type { AppBindings } from "../lib/types";

import { db } from "../db";
import { diagnosticsDTCTable, insertDiagnosticDTCInstanceSchema, selectDiagnosticDTCInstanceSchema } from "../db/schema/diagnostics-dtc-schema";
import { diagnosticsTable, insertDiagnosticSchema, selectDiagnosticSchema } from "../db/schema/diagnostics-schema";
import { insertSensorReadingSchema, selectSensorReadingSchema, sensorReadingsTable } from "../db/schema/sensor-readings-schema";
import { insertSensorSnapshotSchema, selectSensorSnapshotSchema, sensorSnapshotsTable, sensorSourceEnum } from "../db/schema/sensor-snapshots-schema";
import { vehiclesTable } from "../db/schema/vehicles-schema";
import { getSessionAndUser } from "../middleware/get-session-and-user";
import { notFoundResponseObject, unauthorizedResponseObject } from "../zod/z-api-responses";
import { zBulkDTCsResponseSchema, zDiagnosticInsertSchema, zDiagnosticsListResponseSchema } from "../zod/z-diagnostics";

export const diagnosticsRoute = new Hono<AppBindings>()
  .use(getSessionAndUser)
  .get("/", describeRoute({
    tags: ["Diagnostics"],
    summary: "Get all diagnostics",
    description: "Get all diagnostics for the user",
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: resolver(zDiagnosticsListResponseSchema),
          },
        },
      },
      401: unauthorizedResponseObject,
    },
  }), async (c) => {
    const user = c.get("user");
    const logger = c.get("logger");

    if (!user) {
      logger.warn("Unauthorized access attempt - diagnostics list");
      return c.json({ error: "Unauthorized" }, 401);
    }

    logger.debug({ userId: user.id, role: user.role }, "Fetching diagnostics");

    const userVehicleIds = await db
      .select({ uuid: vehiclesTable.uuid })
      .from(vehiclesTable)
      .where(eq(vehiclesTable.ownerId, user.id));

    const diagnostics = await db
      .select()
      .from(diagnosticsTable)
      .where(
        and(
          user.role === "user"
            ? inArray(
                diagnosticsTable.vehicleUUID,
                userVehicleIds.map(v => v.uuid),
              )
            : undefined,
        ),
      )
      .orderBy(diagnosticsTable.createdAt);

    if (diagnostics.length > 0) {
      logger.debug({ count: diagnostics.length }, "Diagnostics found");
    }

    return c.json(diagnostics);
  })
  .post("/", describeRoute({
    tags: ["Diagnostics"],
    summary: "Create a diagnostic",
    description: "Create a diagnostic for a vehicle",
    responses: {
      201: {
        description: "Created",
        content: {
          "application/json": {
            schema: resolver(selectDiagnosticSchema),
          },
        },
      },
      401: unauthorizedResponseObject,
    },
  }), zValidator("json", zDiagnosticInsertSchema), async (c) => {
    const user = c.get("user");
    const logger = c.get("logger");

    if (!user) {
      logger.warn("Unauthorized diagnostic creation attempt");
      return c.json({ error: "Unauthorized" }, 401);
    }

    const diagnostic = c.req.valid("json");

    logger.debug({ diagnostic }, "Creating diagnostic");

    const validatedDiagnostic = insertDiagnosticSchema.parse({
      ...diagnostic,
    });

    const newDiagnostic = await db.insert(diagnosticsTable).values(validatedDiagnostic).returning().then(res => res[0]);

    c.status(201);

    logger.debug({ uuid: newDiagnostic.uuid, vehicleUUID: newDiagnostic.vehicleUUID }, "Diagnostic created");

    return c.json(newDiagnostic);
  })
  .get("/:diagnosticUUID", describeRoute({
    tags: ["Diagnostics"],
    summary: "Get a diagnostic by UUID",
    description: "Get a diagnostic by UUID",
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: resolver(selectDiagnosticSchema),
          },
        },
      },
      401: unauthorizedResponseObject,
      404: notFoundResponseObject,
    },
  }), zValidator("param", z.object({
    diagnosticUUID: z.string().uuid(),
  })), async (c) => {
    const user = c.get("user");
    const logger = c.get("logger");

    if (!user) {
      logger.warn("Unauthorized access attempt - diagnostic details");
      return c.json({ error: "Unauthorized" }, 401);
    }

    const diagnosticUUID = c.req.param("diagnosticUUID");

    const userVehicleIds = await db
      .select({ uuid: vehiclesTable.uuid })
      .from(vehiclesTable)
      .where(eq(vehiclesTable.ownerId, user.id));

    const diagnostic = await db
      .select()
      .from(diagnosticsTable)
      .where(
        and(
          eq(diagnosticsTable.uuid, diagnosticUUID),
          user.role === "user"
            ? inArray(
                diagnosticsTable.vehicleUUID,
                userVehicleIds.map(v => v.uuid),
              )
            : undefined,
        ),
      )
      .then(res => res[0]);

    if (!diagnostic) {
      logger.warn("Diagnostic not found");
      return c.json({ error: "Diagnostic not found" }, 404);
    }

    return c.json(diagnostic);
  })
  .post("/:diagnosticUUID/dtcs", describeRoute({
    tags: ["Diagnostics"],
    summary: "Create multiple DTCs in bulk",
    description: "Create multiple DTCs for a diagnostic in a single request",
    responses: {
      201: {
        description: "Created",
        content: {
          "application/json": {
            schema: resolver(zBulkDTCsResponseSchema),
          },
        },
      },
      401: unauthorizedResponseObject,
      404: notFoundResponseObject,
    },
  }), zValidator("param", z.object({
    diagnosticUUID: z.string().uuid(),
  })), zValidator("json", z.array(z.object({
    code: z.string(),
    confirmed: z.boolean().optional(),
  }))), async (c) => {
    const user = c.get("user");
    const logger = c.get("logger");

    if (!user) {
      logger.warn("Unauthorized DTC bulk creation attempt");
      return c.json({ error: "Unauthorized" }, 401);
    }

    const diagnosticUUID = c.req.param("diagnosticUUID");
    const dtcs = c.req.valid("json");

    logger.debug({ diagnosticUUID, dtcCount: dtcs.length }, "Bulk creating DTCs");

    // Find the diagnostic first
    const diagnostic = await db
      .select()
      .from(diagnosticsTable)
      .where(eq(diagnosticsTable.uuid, diagnosticUUID))
      .then(res => res[0]);

    if (!diagnostic) {
      logger.warn("Diagnostic not found for DTC bulk creation");
      return c.json({ error: "Diagnostic not found" }, 404);
    }

    // If user role is 'user', verify they own the vehicle
    if (user.role === "user") {
      const vehicle = await db
        .select()
        .from(vehiclesTable)
        .where(
          and(
            eq(vehiclesTable.uuid, diagnostic.vehicleUUID),
            eq(vehiclesTable.ownerId, user.id),
          ),
        )
        .then(res => res[0]);

      if (!vehicle) {
        logger.warn("User not authorized to add DTCs to this diagnostic");
        return c.json({ error: "Unauthorized to modify this diagnostic" }, 401);
      }
    }

    // Prepare the DTCs for insertion
    const dtcsToInsert = dtcs.map(dtc => ({
      diagnosticUUID: diagnostic.uuid,
      code: dtc.code,
      confirmed: dtc.confirmed ?? false,
    }));

    // Validate all DTCs
    const validatedDTCs = dtcsToInsert.map(dtc => insertDiagnosticDTCInstanceSchema.parse(dtc));

    // Insert all DTCs
    const newDTCs = await db.insert(diagnosticsDTCTable).values(validatedDTCs).returning();

    c.status(201);

    logger.debug({
      diagnosticUUID: diagnostic.uuid,
      dtcCount: newDTCs.length,
    }, "DTCs bulk created");

    return c.json({
      message: "DTCs created successfully",
      count: newDTCs.length,
      dtcs: newDTCs,
    });
  })
  .get("/:diagnosticUUID/dtcs", describeRoute({
    tags: ["Diagnostics"],
    summary: "Get all DTCs for a diagnostic",
    description: "Get all DTCs for a diagnostic",
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: resolver(z.array(selectDiagnosticDTCInstanceSchema)),
          },
        },
      },
      401: unauthorizedResponseObject,
      404: notFoundResponseObject,
    },
  }), zValidator("param", z.object({
    diagnosticUUID: z.string().uuid(),
  })), async (c) => {
    const user = c.get("user");
    const logger = c.get("logger");

    if (!user) {
      logger.warn("Unauthorized access attempt - diagnostic DTCs");
      return c.json({ error: "Unauthorized" }, 401);
    }

    const diagnosticUUID = c.req.param("diagnosticUUID");

    logger.debug({ diagnosticUUID }, "Fetching diagnostic DTCs");

    const dtcs = await db
      .select()
      .from(diagnosticsDTCTable)
      .where(eq(diagnosticsDTCTable.diagnosticUUID, diagnosticUUID))
      .orderBy(diagnosticsDTCTable.createdAt);

    return c.json(dtcs);
  })
  .post("/:diagnosticUUID/snapshots", describeRoute({
    tags: ["Diagnostics"],
    summary: "Create a sensor snapshot with readings",
    description: "Create a sensor snapshot and its readings for a specific diagnostic",
    responses: {
      201: {
        description: "Created",
        content: {
          "application/json": {
            schema: resolver(z.object({
              snapshot: selectSensorSnapshotSchema,
              readings: z.array(selectSensorReadingSchema),
            })),
          },
        },
      },
      401: unauthorizedResponseObject,
      404: notFoundResponseObject,
    },
  }), zValidator("param", z.object({
    diagnosticUUID: z.string().uuid(),
  })), zValidator("json", z.object({
    source: z.enum(sensorSourceEnum.enumValues).optional(),
    readings: z.array(z.object({
      pid: z.string(),
      value: z.number(),
      unit: z.string(),
      timestamp: z.string(),
    })),
  })), async (c) => {
    const user = c.get("user");
    const logger = c.get("logger");

    if (!user) {
      logger.warn("Unauthorized snapshot creation attempt");
      return c.json({ error: "Unauthorized" }, 401);
    }

    const diagnosticUUID = c.req.param("diagnosticUUID");
    const { source, readings } = c.req.valid("json");

    logger.debug({ diagnosticUUID, readingCount: readings.length }, "Creating sensor snapshot");

    // Find the diagnostic first
    const diagnostic = await db
      .select()
      .from(diagnosticsTable)
      .where(eq(diagnosticsTable.uuid, diagnosticUUID))
      .then(res => res[0]);

    if (!diagnostic) {
      logger.warn("Diagnostic not found for snapshot creation");
      return c.json({ error: "Diagnostic not found" }, 404);
    }

    // If user role is 'user', verify they own the vehicle
    if (user.role === "user") {
      const vehicle = await db
        .select()
        .from(vehiclesTable)
        .where(
          and(
            eq(vehiclesTable.uuid, diagnostic.vehicleUUID),
            eq(vehiclesTable.ownerId, user.id),
          ),
        )
        .then(res => res[0]);

      if (!vehicle) {
        logger.warn("User not authorized to add snapshot to this diagnostic");
        return c.json({ error: "Unauthorized to modify this diagnostic" }, 401);
      }
    }

    // Create the sensor snapshot
    const snapshotData: {
      diagnosticUUID: string;
      source?: typeof sensorSourceEnum.enumValues[number];
    } = {
      diagnosticUUID: diagnostic.uuid,
    };

    // Only add source if it has a value
    if (source) {
      snapshotData.source = source;
    }

    const validatedSensorSnapshot = insertSensorSnapshotSchema.parse(snapshotData);

    const snapshot = await db
      .insert(sensorSnapshotsTable)
      .values(validatedSensorSnapshot)
      .returning()
      .then(res => res[0]);

    // Create sensor readings
    if (readings.length > 0) {
      const readingsToInsert = readings.map(reading =>
        insertSensorReadingSchema.parse({
          sensorSnapshotsUUID: snapshot.uuid,
          pid: reading.pid,
          value: reading.value,
          unit: reading.unit,
          timestamp: new Date(reading.timestamp),
        }),
      );

      await db
        .insert(sensorReadingsTable)
        .values(readingsToInsert);
    }

    c.status(201);
    logger.debug({ snapshotUUID: snapshot.uuid, readingCount: readings.length }, "Sensor snapshot created");

    // Query the inserted readings to return with the response
    const insertedReadings = readings.length > 0
      ? await db.select().from(sensorReadingsTable).where(eq(sensorReadingsTable.sensorSnapshotsUUID, snapshot.uuid))
      : [];

    return c.json({
      snapshot,
      readings: insertedReadings,
    });
  })
  .get("/:diagnosticUUID/snapshots", describeRoute({
    tags: ["Diagnostics"],
    summary: "Get all snapshots for a diagnostic",
    description: "Retrieve all sensor snapshots for a specific diagnostic with optional readings",
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: resolver(z.object({
              snapshots: z.array(
                z.object({
                  ...selectSensorSnapshotSchema.shape,
                  readings: z.array(selectSensorReadingSchema).optional(),
                }),
              ),
            })),
          },
        },
      },
      401: unauthorizedResponseObject,
      404: notFoundResponseObject,
    },
  }), zValidator("param", z.object({
    diagnosticUUID: z.string().uuid(),
  })), zValidator("query", z.object({
    includeReadings: z.enum(["true", "false"])
      .optional()
      .default("false")
      .transform(val => val === "true")
      .pipe(z.boolean()),
  })), async (c) => {
    const user = c.get("user");
    const logger = c.get("logger");

    if (!user) {
      logger.warn("Unauthorized access attempt - diagnostic snapshots");
      return c.json({ error: "Unauthorized" }, 401);
    }

    const diagnosticUUID = c.req.param("diagnosticUUID");
    const { includeReadings } = c.req.valid("query");

    logger.debug({ diagnosticUUID, includeReadings }, "Fetching diagnostic snapshots");

    // Find the diagnostic first
    const diagnostic = await db
      .select()
      .from(diagnosticsTable)
      .where(eq(diagnosticsTable.uuid, diagnosticUUID))
      .then(res => res[0]);

    if (!diagnostic) {
      logger.warn("Diagnostic not found");
      return c.json({ error: "Diagnostic not found" }, 404);
    }

    // If user role is 'user', verify they own the vehicle
    if (user.role === "user") {
      const vehicle = await db
        .select()
        .from(vehiclesTable)
        .where(
          and(
            eq(vehiclesTable.uuid, diagnostic.vehicleUUID),
            eq(vehiclesTable.ownerId, user.id),
          ),
        )
        .then(res => res[0]);

      if (!vehicle) {
        logger.warn("User not authorized to view this diagnostic's snapshots");
        return c.json({ error: "Unauthorized to access this diagnostic" }, 401);
      }
    }

    // Get snapshots for the diagnostic
    const snapshots = await db
      .select()
      .from(sensorSnapshotsTable)
      .where(eq(sensorSnapshotsTable.diagnosticUUID, diagnostic.uuid))
      .orderBy(sensorSnapshotsTable.createdAt);

    if (snapshots.length === 0) {
      return c.json({ snapshots: [] });
    }

    // If includeReadings is true, fetch readings for all snapshots
    if (includeReadings) {
      const allReadings = await db
        .select()
        .from(sensorReadingsTable)
        .where(inArray(
          sensorReadingsTable.sensorSnapshotsUUID,
          snapshots.map(snapshot => snapshot.uuid),
        ));

      // Add readings to each snapshot
      const snapshotsWithReadings = snapshots.map((snapshot) => {
        const snapshotReadings = allReadings.filter(
          reading => reading.sensorSnapshotsUUID === snapshot.uuid,
        );

        return {
          ...snapshot,
          readings: snapshotReadings.length > 0 ? snapshotReadings : undefined,
        };
      });

      return c.json({ snapshots: snapshotsWithReadings });
    }

    return c.json({ snapshots });
  })
  .get("/:diagnosticUUID/snapshots/:snapshotUUID", describeRoute({
    tags: ["Diagnostics"],
    summary: "Get a specific snapshot with readings",
    description: "Retrieve a specific sensor snapshot and its readings",
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: resolver(z.object({
              snapshot: selectSensorSnapshotSchema,
              readings: z.array(selectSensorReadingSchema),
            })),
          },
        },
      },
      401: unauthorizedResponseObject,
      404: notFoundResponseObject,
    },
  }), zValidator("param", z.object({
    diagnosticUUID: z.string().uuid(),
    snapshotUUID: z.string().uuid(),
  })), async (c) => {
    const user = c.get("user");
    const logger = c.get("logger");

    if (!user) {
      logger.warn("Unauthorized access attempt - snapshot details");
      return c.json({ error: "Unauthorized" }, 401);
    }

    const diagnosticUUID = c.req.param("diagnosticUUID");
    const snapshotUUID = c.req.param("snapshotUUID");

    logger.debug({ diagnosticUUID, snapshotUUID }, "Fetching snapshot details");

    // Find the diagnostic first
    const diagnostic = await db
      .select()
      .from(diagnosticsTable)
      .where(eq(diagnosticsTable.uuid, diagnosticUUID))
      .then(res => res[0]);

    if (!diagnostic) {
      logger.warn("Diagnostic not found");
      return c.json({ error: "Diagnostic not found" }, 404);
    }

    // If user role is 'user', verify they own the vehicle
    if (user.role === "user") {
      const vehicle = await db
        .select()
        .from(vehiclesTable)
        .where(
          and(
            eq(vehiclesTable.uuid, diagnostic.vehicleUUID),
            eq(vehiclesTable.ownerId, user.id),
          ),
        )
        .then(res => res[0]);

      if (!vehicle) {
        logger.warn("User not authorized to view this snapshot");
        return c.json({ error: "Unauthorized to access this diagnostic" }, 401);
      }
    }

    // Get the specific snapshot
    const snapshot = await db
      .select()
      .from(sensorSnapshotsTable)
      .where(
        and(
          eq(sensorSnapshotsTable.uuid, snapshotUUID),
          eq(sensorSnapshotsTable.diagnosticUUID, diagnostic.uuid),
        ),
      )
      .then(res => res[0]);

    if (!snapshot) {
      logger.warn("Snapshot not found");
      return c.json({ error: "Snapshot not found" }, 404);
    }

    // Get readings for the snapshot
    const readings = await db
      .select()
      .from(sensorReadingsTable)
      .where(eq(sensorReadingsTable.sensorSnapshotsUUID, snapshot.uuid))
      .orderBy(sensorReadingsTable.pid);

    return c.json({
      snapshot,
      readings,
    });
  });
