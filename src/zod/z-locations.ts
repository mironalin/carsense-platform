import { z } from "zod";

import { insertLocationSchema, selectLocationSchema } from "@/db/schema/locations-schema";

// =============================================================================
// Input Schemas - Used for validating request payloads
// =============================================================================

/**
 * Schema for location creation requests
 */
export const zLocationInsertSchema = insertLocationSchema.omit({
  uuid: true,
  createdAt: true,
  updatedAt: true,
});

export type LocationInsertSchema = z.infer<typeof zLocationInsertSchema>;

// =============================================================================
// Single Location Response Schemas
// =============================================================================

/**
 * Schema for retrieving a single location
 */
export const zLocationGetResponseSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  vehicleId: z.number(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    accuracy: z.number().nullable(),
  }),
  timestamps: z.object({
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
});

export type LocationGetResponse = z.infer<typeof zLocationGetResponseSchema>;

/**
 * Schema for updating a location
 */
export const zLocationUpdateResponseSchema = selectLocationSchema;
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
 * Schema for location delete operation response
 */
export const zLocationDeleteResponseSchema = z.object({
  message: z.string().openapi({ example: "Location deleted successfully" }),
  locationUUID: z.string().openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
});
export type LocationDeleteResponse = z.infer<typeof zLocationDeleteResponseSchema>;
