import { z } from "zod";
import "zod-openapi/extend";

import { insertVehicleSchema, selectVehicleSchema } from "../db/schema/vehicles-schema";

// =============================================================================
// Input Schemas - Used for validating request payloads
// =============================================================================

/**
 * Schema for vehicle creation requests
 */
export const zVehicleInsertSchema = insertVehicleSchema.omit({
  uuid: true,
  ownerId: true,
  odometerUpdatedAt: true,
  createdAt: true,
  updatedAt: true,
});

export type VehicleInsertSchema = z.infer<typeof zVehicleInsertSchema>;

// =============================================================================
// Single Vehicle Response Schemas
// =============================================================================

/**
 * Schema for retrieving a single vehicle
 */
export const zVehicleGetResponseSchema = selectVehicleSchema;
export type VehicleGetResponse = z.infer<typeof zVehicleGetResponseSchema>;

/**
 * Schema for updating a vehicle
 */
export const zVehicleUpdateResponseSchema = selectVehicleSchema;
export type VehicleUpdateResponse = z.infer<typeof zVehicleUpdateResponseSchema>;

/**
 * Schema for vehicle creation response
 */
export const zVehicleCreateResponseSchema = z.object({
  vehicle: selectVehicleSchema,
  created: z.boolean().openapi({ example: true }),
});
export type VehicleCreateResponse = z.infer<typeof zVehicleCreateResponseSchema>;

// =============================================================================
// Collection Response Schemas
// =============================================================================

/**
 * Schema for listing multiple vehicles
 */
export const zVehiclesListResponseSchema = z.array(selectVehicleSchema);
export type VehiclesListResponse = z.infer<typeof zVehiclesListResponseSchema>;

// =============================================================================
// Operation Response Schemas
// =============================================================================

/**
 * Schema for vehicle restore operation response
 */
export const zVehicleRestoreResponseSchema = z.object({
  vehicle: selectVehicleSchema,
  restored: z.boolean().openapi({ example: true }),
});
export type VehicleRestoreResponse = z.infer<typeof zVehicleRestoreResponseSchema>;

/**
 * Schema for vehicle delete operation response
 */
export const zVehicleDeleteResponseSchema = z.object({
  message: z.string().openapi({ example: "Vehicle soft deleted successfully" }),
  vehicleUUID: z.string().openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
});
export type VehicleDeleteResponse = z.infer<typeof zVehicleDeleteResponseSchema>;
