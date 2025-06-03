import {
  doublePrecision,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import { vehiclesTable } from "./vehicles-schema";

export const locationsTable = pgTable("locations", {
  uuid: uuid("uuid").primaryKey().defaultRandom(),
  vehicleUUID: uuid("vehicleUUID")
    .notNull()
    .references(() => vehiclesTable.uuid, { onDelete: "cascade" }),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  altitude: doublePrecision("altitude"),
  speed: doublePrecision("speed"),
  accuracy: doublePrecision("accuracy"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertLocationSchema = createInsertSchema(locationsTable);

export const selectLocationSchema = createSelectSchema(locationsTable);

export const updateLocationSchema = createUpdateSchema(locationsTable);
