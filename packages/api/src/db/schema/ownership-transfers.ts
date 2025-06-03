import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import { user } from "./auth-schema";
import { vehiclesTable } from "./vehicles-schema";

export const ownershipTransfersTable = pgTable("ownershipTransfers", {
  uuid: uuid("uuid").primaryKey().defaultRandom(),
  vehicleUUID: uuid("vehicleUUID")
    .notNull()
    .references(() => vehiclesTable.uuid, { onDelete: "cascade" }),
  fromUserId: text("fromUserId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  toUserId: text("toUserId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  transferredAt: timestamp("transferredAt").defaultNow().notNull(),
});

export const insertOwnershipTransferSchema = createInsertSchema(
  ownershipTransfersTable,
);

export const updateOwnershipTransferSchema = createUpdateSchema(
  ownershipTransfersTable,
);

export const selectOwnershipTransferSchema = createSelectSchema(
  ownershipTransfersTable,
);
