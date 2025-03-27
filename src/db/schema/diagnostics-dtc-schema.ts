import {
  boolean,
  integer,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import { diagnosticsTable } from "@/db/schema/diagnostics-schema";
import { DTCLibraryTable } from "@/db/schema/dtc-library-schema";

export const diagnosticsDTCTable = pgTable("diagnosticDTC", {
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

export const insertDTCInstanceSchema = createInsertSchema(diagnosticsDTCTable);

export const updateDTCInstanceSchema = createUpdateSchema(diagnosticsDTCTable);

export const selectDTCInstanceSchema = createSelectSchema(diagnosticsDTCTable);
