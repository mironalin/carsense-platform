import { z } from "zod";

import { selectDiagnosticDTCInstanceSchema } from "@/db/schema/diagnostics-dtc-schema";
import { insertDiagnosticSchema, selectDiagnosticSchema } from "@/db/schema/diagnostics-schema";

export const zDiagnosticsListResponseSchema = z.array(selectDiagnosticSchema);

export const zDiagnosticInsertSchema = insertDiagnosticSchema.omit({
  uuid: true,
  createdAt: true,
  updatedAt: true,
});

export type DiagnosticInsertSchema = z.infer<typeof zDiagnosticInsertSchema>;

export const zBulkDTCsResponseSchema = z.object({
  message: z.string().openapi({ example: "DTCs created successfully" }),
  count: z.number().openapi({ example: 1 }),
  dtcs: z.array(selectDiagnosticDTCInstanceSchema),
});
