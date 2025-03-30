import {
  doublePrecision,
  integer,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import { vehiclesTable } from "@/db/schema/vehicles-schema";

export const locationsTable = pgTable("locations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid("uuid").defaultRandom(),
  vehicleId: integer("vehicle_id").references(() => vehiclesTable.id),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  accuracy: doublePrecision("accuracy"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertLocationSchema = createInsertSchema(locationsTable);

export const selectLocationSchema = createSelectSchema(locationsTable);

export const updateLocationSchema = createUpdateSchema(locationsTable);
