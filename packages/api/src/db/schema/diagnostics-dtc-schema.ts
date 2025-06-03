import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import { diagnosticsTable } from "./diagnostics-schema";
import { DTCLibraryTable } from "./dtc-library-schema";

export const diagnosticsDTCTable = pgTable("diagnosticDTC", {
  uuid: uuid("uuid").primaryKey().defaultRandom(),
  diagnosticUUID: uuid("diagnosticUUID").references(() => diagnosticsTable.uuid, { onDelete: "cascade" }),
  code: text("code")
    .notNull()
    .references(() => DTCLibraryTable.code),
  confirmed: boolean("confirmed"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertDiagnosticDTCInstanceSchema = createInsertSchema(diagnosticsDTCTable);

export const updateDiagnosticDTCInstanceSchema = createUpdateSchema(diagnosticsDTCTable);

export const selectDiagnosticDTCInstanceSchema = createSelectSchema(diagnosticsDTCTable);
