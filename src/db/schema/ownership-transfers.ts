import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { vehiclesTable } from "./vehicles-schema";
import { user } from "./auth-schema";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

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
