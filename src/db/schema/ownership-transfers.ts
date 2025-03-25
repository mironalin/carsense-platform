import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import { user } from "@/db/schema/auth-schema";
import { vehiclesTable } from "@/db/schema/vehicles-schema";

export const ownershipTransfersTable = pgTable("ownershipTransfers", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid("uuid").defaultRandom(),
  vehicleId: integer("vehicleId")
    .notNull()
    .references(() => vehiclesTable.id, { onDelete: "cascade" }),
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
