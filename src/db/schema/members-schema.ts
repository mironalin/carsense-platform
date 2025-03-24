import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

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

export const updateMemberSchema = createUpdateSchema(membersTable);

export const selectMemberSchema = createSelectSchema(membersTable);
