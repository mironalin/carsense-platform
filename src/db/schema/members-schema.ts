import {
  integer,
  pgEnum,
  PgRole,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { generateUniqueString } from "../../utils/generateUniqueString";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const rolesEnum = pgEnum("roles", ["admin", "user"]);

export const membersTable = pgTable("members", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid("uuid").defaultRandom(),
  userId: text("userId").notNull(),
  role: rolesEnum("role").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const insertMemberSchema = createInsertSchema(membersTable);

export const updateMemberSchema = createInsertSchema(membersTable)
  .pick({ role: true })
  .partial();

export const selectMemberSchema = createSelectSchema(membersTable);
