import { doublePrecision, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

import { sensorSnapshotsTable } from "./sensor-snapshots-schema";

export const sensorReadingsTable = pgTable("sensorReadings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid("uuid").notNull().defaultRandom(),
  sensorSnapshotsUUID: uuid("sensorSnapshotsUUID").references(() => sensorSnapshotsTable.uuid, {
    onDelete: "cascade",
  }),
  pid: text("pid").notNull(), // eg: "rpm", "temp", "fuel", "speed"
  value: doublePrecision("value").notNull(),
  unit: text("unit").notNull(), // eg: "RPM", "°C", "%", "km/h"
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertSensorReadingSchema = createInsertSchema(sensorReadingsTable);

export const updateSensorReadingSchema = createUpdateSchema(sensorReadingsTable);

export const selectSensorReadingSchema = createSelectSchema(sensorReadingsTable);
