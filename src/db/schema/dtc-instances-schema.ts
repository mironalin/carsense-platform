import {
  boolean,
  integer,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { diagnosticsTable } from "./diagnostics-schema";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { DTCLibraryTable } from "./dtc-library-schema";

export const DTCInstancesTable = pgTable("dtcInstances", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid("uuid").defaultRandom(),
  diagnosticId: integer("diagnosticId")
    .notNull()
    .references(() => diagnosticsTable.id, { onDelete: "cascade" }),
  codeRefId: integer("codeRefId")
    .notNull()
    .references(() => DTCLibraryTable.id),
  confirmed: boolean("confirmed"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const insertDTCInstanceSchema = createInsertSchema(DTCInstancesTable);

export const updateDTCInstanceSchema = createUpdateSchema(DTCInstancesTable);

export const selectDTCInstanceSchema = createSelectSchema(DTCInstancesTable);
