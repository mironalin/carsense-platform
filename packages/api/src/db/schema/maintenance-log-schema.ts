import {
  doublePrecision,
  integer,
  pgEnum,
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

import { serviceWorkshopsTable } from "./service-workshops-schema";
import { vehiclesTable } from "./vehicles-schema";

export const serviceTypeEnum = pgEnum("serviceType", [
  // Routine Maintenance
  "oil_change",
  "oil_filter_replacement",
  "air_filter_replacement",
  "cabin_filter_replacement",
  "fuel_filter_replacement",
  "tire_rotation",
  "tire_replacement",
  "general_inspection",
  "multi_point_inspection",
  "windshield_wiper_replacement",

  // Engine & Transmission
  "engine_diagnostics",
  "transmission_service",
  "transmission_fluid_change",
  "differential_service",
  "timing_belt_replacement",
  "timing_chain_replacement",
  "spark_plug_replacement",
  "ignition_coil_replacement",
  "engine_overhaul",
  "valve_adjustment",
  "head_gasket_replacement",

  // Brakes & Suspension
  "brake_replacement",
  "brake_pad_replacement",
  "brake_rotor_replacement",
  "brake_fluid_change",
  "suspension_inspection",
  "shock_absorber_replacement",
  "strut_replacement",
  "wheel_alignment",
  "wheel_balancing",

  // Electrical & Cooling
  "battery_replacement",
  "alternator_replacement",
  "starter_replacement",
  "coolant_flush",
  "radiator_replacement",
  "thermostat_replacement",
  "water_pump_replacement",
  "ac_service",
  "ac_compressor_replacement",
  "ac_recharge",

  // Drivetrain & Power Steering
  "clutch_replacement",
  "cv_joint_replacement",
  "drive_belt_replacement",
  "serpentine_belt_replacement",
  "power_steering_fluid_change",
  "power_steering_pump_replacement",

  // Exhaust & Emissions
  "exhaust_repair",
  "muffler_replacement",
  "catalytic_converter_replacement",
  "emissions_test",
  "oxygen_sensor_replacement",

  // Technology & Software
  "software_update",
  "diagnostic_scan",
  "ecu_programming",

  // Body & Interior
  "light_bulb_replacement",
  "headlight_restoration",
  "window_tinting",
  "paint_touch_up",
]);

export const maintenanceLogTable = pgTable("maintenanceLog", {
  uuid: uuid("uuid").primaryKey().defaultRandom(),
  vehicleUUID: uuid("vehicleUUID")
    .notNull()
    .references(() => vehiclesTable.uuid, { onDelete: "cascade" }),
  serviceWorkshopUUID: uuid("serviceWorkshopUUID")
    .notNull()
    .references(() => serviceWorkshopsTable.uuid, { onDelete: "cascade" }),
  customServiceWorkshopName: text("customServiceWorkshopName"),
  serviceDate: timestamp("serviceDate").notNull(),
  // Removed serviceType field - now handled by maintenanceLogServices table
  odometer: integer("odometer"), // Vehicle odometer reading at time of service
  cost: doublePrecision("cost"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertMaintenanceLogSchema
  = createInsertSchema(maintenanceLogTable);

export const selectMaintenanceLogSchema
  = createSelectSchema(maintenanceLogTable);

export const updateMaintenanceLogSchema
  = createUpdateSchema(maintenanceLogTable);
