import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

import { user } from "./auth-schema";
import { vehiclesTable } from "./vehicles-schema";

// Enum for transfer request status
export const transferStatusEnum = pgEnum("transfer_status", [
  "pending",
  "accepted",
  "rejected",
  "cancelled",
  "expired",
]);

export const transferRequestsTable = pgTable("transferRequests", {
  uuid: uuid("uuid").primaryKey().defaultRandom(),
  vehicleUUID: uuid("vehicleUUID")
    .notNull()
    .references(() => vehiclesTable.uuid, { onDelete: "cascade" }),
  fromUserId: text("fromUserId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  toUserEmail: text("toUserEmail").notNull(), // Email for identification
  toUserId: text("toUserId")
    .references(() => user.id, { onDelete: "cascade" }), // Null until user is found/registered
  status: transferStatusEnum("status").notNull().default("pending"),
  message: text("message"), // Optional message from sender
  requestedAt: timestamp("requestedAt").defaultNow().notNull(),
  respondedAt: timestamp("respondedAt"),
  expiresAt: timestamp("expiresAt").notNull(), // Auto-expire after 7 days
});

export const insertTransferRequestSchema = createInsertSchema(
  transferRequestsTable,
);

export const updateTransferRequestSchema = createUpdateSchema(
  transferRequestsTable,
);

export const selectTransferRequestSchema = createSelectSchema(
  transferRequestsTable,
);
