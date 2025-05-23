import { z } from "zod";
import "zod-openapi/extend";

import { selectDiagnosticDTCInstanceSchema } from "../db/schema/diagnostics-dtc-schema";
import { insertDiagnosticSchema, selectDiagnosticSchema } from "../db/schema/diagnostics-schema";

// =============================================================================
// Input Schemas - Used for validating request payloads
// =============================================================================

/**
 * Schema for diagnostic creation requests
 */
export const zDiagnosticInsertSchema = insertDiagnosticSchema.omit({
  uuid: true,
  createdAt: true,
  updatedAt: true,
});

export type DiagnosticInsertSchema = z.infer<typeof zDiagnosticInsertSchema>;

// =============================================================================
// Collection Response Schemas
// =============================================================================

/**
 * Schema for listing multiple diagnostics
 */
export const zDiagnosticsListResponseSchema = z.array(selectDiagnosticSchema);

// =============================================================================
// Operation Response Schemas
// =============================================================================

/**
 * Schema for bulk DTC creation response
 */
export const zBulkDTCsResponseSchema = z.object({
  message: z.string().openapi({ example: "DTCs created successfully" }),
  count: z.number().openapi({ example: 1 }),
  dtcs: z.array(selectDiagnosticDTCInstanceSchema),
});
