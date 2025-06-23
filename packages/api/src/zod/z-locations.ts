import { z } from "zod";
import "zod-openapi/extend";

import { insertLocationSchema, selectLocationSchema, updateLocationSchema } from "../db/schema/locations-schema";

// =============================================================================
// Input Schemas - Used for validating request payloads
// =============================================================================

/**
 * Schema for location creation requests
 */
export const zLocationInsertSchema = insertLocationSchema.omit({
  uuid: true,
  timestamp: true,
});

/**
 * Schema for bulk location creation requests (tied to diagnostic session)
 */
export const zBulkLocationInsertSchema = insertLocationSchema.omit({
  uuid: true,
  timestamp: true,
  diagnosticUUID: true, // This will be provided in the URL parameter
});

export type LocationInsertSchema = z.infer<typeof zLocationInsertSchema>;

// =============================================================================
// Single Location Response Schemas
// =============================================================================

/**
 * Schema for retrieving a single location
 */
export const zLocationGetResponseSchema = selectLocationSchema;

export type LocationGetResponse = z.infer<typeof zLocationGetResponseSchema>;

/**
 * Schema for updating a location
 */
export const zLocationUpdateResponseSchema = updateLocationSchema;
export type LocationUpdateResponse = z.infer<typeof zLocationUpdateResponseSchema>;

// =============================================================================
// Collection Response Schemas
// =============================================================================

/**
 * Schema for listing multiple locations
 */
export const zLocationsListResponseSchema = z.array(zLocationGetResponseSchema);
export type LocationsListResponse = z.infer<typeof zLocationsListResponseSchema>;

// =============================================================================
// Operation Response Schemas
// =============================================================================

/**
 * Schema for bulk location creation response
 */
export const zBulkLocationsResponseSchema = z.object({
  message: z.string().openapi({ example: "Locations created successfully" }),
  count: z.number().openapi({ example: 5 }),
  locations: z.array(zLocationGetResponseSchema),
});
export type BulkLocationsResponse = z.infer<typeof zBulkLocationsResponseSchema>;

/**
 * Schema for location delete operation response
 */
export const zLocationDeleteResponseSchema = z.object({
  message: z.string().openapi({ example: "Location deleted successfully" }),
  locationUUID: z.string().openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
});
export type LocationDeleteResponse = z.infer<typeof zLocationDeleteResponseSchema>;
