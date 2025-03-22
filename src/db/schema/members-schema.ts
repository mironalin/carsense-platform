import {
  integer,
  pgEnum,
  PgRole,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { generateUniqueString } from "../../utils/generateUniqueString";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const rolesEnum = pgEnum("roles", ["admin", "user"]);

export const membersTable = pgTable("members", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar().$default(() => generateUniqueString(16)),
  userId: text("userId").notNull(),
  role: rolesEnum().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const insertMemberSchema = createInsertSchema(membersTable);

export const updateMemberSchema = createInsertSchema(membersTable)
  .pick({ role: true })
  .partial();

export const selectMemberSchema = createSelectSchema(membersTable);
