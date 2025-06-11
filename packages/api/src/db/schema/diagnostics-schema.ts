import {
  doublePrecision,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import { vehiclesTable } from "./vehicles-schema";

export const diagnosticsTable = pgTable("diagnostics", {
  uuid: uuid("uuid").primaryKey().defaultRandom(),
  vehicleUUID: uuid("vehicleUUID").notNull().references(() => vehiclesTable.uuid, {
    onDelete: "cascade",
  }),
  odometer: integer("odometer").notNull(),
  locationLat: doublePrecision("locationLat"),
  locationLong: doublePrecision("locationLong"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertDiagnosticSchema = createInsertSchema(diagnosticsTable);

export const updateDiagnosticSchema = createUpdateSchema(diagnosticsTable);

export const selectDiagnosticSchema = createSelectSchema(diagnosticsTable);
