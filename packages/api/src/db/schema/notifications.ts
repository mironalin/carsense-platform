import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

import { user } from "./auth-schema";

export const notificationsTable = pgTable("notifications", {
  uuid: uuid("uuid").primaryKey().defaultRandom(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // "transfer_request", "transfer_accepted", etc.
  title: text("title").notNull(),
  message: text("message").notNull(),
  data: text("data"), // JSON string for additional data (transferRequestUUID, etc.)
  isRead: text("isRead").notNull().default("false"), // Using text to avoid boolean issues
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const insertNotificationSchema = createInsertSchema(
  notificationsTable,
);

export const updateNotificationSchema = createUpdateSchema(
  notificationsTable,
);

export const selectNotificationSchema = createSelectSchema(
  notificationsTable,
);
