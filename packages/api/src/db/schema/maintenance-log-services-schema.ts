import {
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
} from "drizzle-zod";

import { maintenanceLogTable, serviceTypeEnum } from "./maintenance-log-schema";

export const maintenanceLogServicesTable = pgTable("maintenanceLogServices", {
  uuid: uuid("uuid").primaryKey().defaultRandom(),
  maintenanceLogUUID: uuid("maintenanceLogUUID")
    .notNull()
    .references(() => maintenanceLogTable.uuid, { onDelete: "cascade" }),
  serviceType: serviceTypeEnum("serviceType").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertMaintenanceLogServiceSchema = createInsertSchema(
  maintenanceLogServicesTable,
);

export const selectMaintenanceLogServiceSchema = createSelectSchema(
  maintenanceLogServicesTable,
);
