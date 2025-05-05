import { z } from "zod";
import "zod-openapi/extend";

import { selectDTCLibrarySchema } from "@/db/schema/dtc-library-schema";

// =============================================================================
// Query Schemas - Used for validating request parameters
// =============================================================================

/**
 * Schema for querying DTC by code
 */
export const zDTCQuerySchema = z.object({
  code: z.string().min(1).openapi({ example: "P0001" }),
});

export type DTCQuerySchema = z.infer<typeof zDTCQuerySchema>;

// =============================================================================
// Response Schemas - Used for validating and documenting responses
// =============================================================================

/**
 * Schema for DTC library item responses
 */
export const zDTCLibraryResponseSchema = selectDTCLibrarySchema; 