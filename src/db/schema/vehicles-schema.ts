import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { membersTable } from "./members-schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const vehiclesTable = pgTable("vehicles", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid("uuid").defaultRandom(),
  ownerId: integer("ownerId")
    .notNull()
    .references(() => membersTable.id, { onDelete: "cascade" }),
  vin: text("vin").notNull().unique(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  engineType: text("engineType").notNull(),
  fuelType: text("fuelType").notNull(),
  transmissionType: text("transmissionType").notNull(),
  drivetrain: text("drivetrain").notNull(),
  licensePlate: text("licensePlate").notNull(),
  odometerUpdatedAt: timestamp("odometerUpdatedAt").notNull().defaultNow(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const insertVehicleSchema = createInsertSchema(vehiclesTable);

export const updateVehicleSchema = createInsertSchema(vehiclesTable).partial();

export const selectVehicleSchema = createSelectSchema(vehiclesTable);
