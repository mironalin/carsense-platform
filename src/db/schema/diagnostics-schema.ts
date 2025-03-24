import {
  doublePrecision,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { vehiclesTable } from "./vehicles-schema";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const diagnosticsTable = pgTable("diagnostics", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid("uuid").defaultRandom(),
  vehicleId: integer("vehicleId").references(() => vehiclesTable.id, {
    onDelete: "cascade",
  }),
  odometer: integer("odometer").notNull(),
  locationLat: doublePrecision("locationLat"),
  locationLong: doublePrecision("locationLong"),
  notes: text("notes").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const insertDiagnosticSchema = createInsertSchema(diagnosticsTable);

export const updateDiagnosticSchema = createUpdateSchema(diagnosticsTable);

export const selectDiagnosticSchema = createSelectSchema(diagnosticsTable);
