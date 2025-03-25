import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import { user } from "@/db/schema/auth-schema";

export const vehiclesTable = pgTable("vehicles", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid("uuid").notNull().defaultRandom(),
  ownerId: text("ownerId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  vin: text("vin").notNull().unique(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  engineType: text("engineType").notNull(),
  fuelType: text("fuelType").notNull(),
  transmissionType: text("transmissionType").notNull(),
  drivetrain: text("drivetrain").notNull(),
  licensePlate: text("licensePlate").notNull(),
  odometerUpdatedAt: timestamp("odometerUpdatedAt").defaultNow(),
  deletedAt: timestamp("deletedAt"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const insertVehicleSchema = createInsertSchema(vehiclesTable);

export const updateVehicleSchema = createUpdateSchema(vehiclesTable);

export const selectVehicleSchema = createSelectSchema(vehiclesTable);
