import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import { user } from "./auth-schema";

export const vehiclesTable = pgTable("vehicles", {
  uuid: uuid("uuid").primaryKey().defaultRandom(),
  ownerId: text("ownerId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  vin: text("vin").unique(),
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
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertVehicleSchema = createInsertSchema(vehiclesTable);

export const updateVehicleSchema = createUpdateSchema(vehiclesTable);

export const selectVehicleSchema = createSelectSchema(vehiclesTable);
