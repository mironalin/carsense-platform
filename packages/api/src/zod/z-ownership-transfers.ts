import { z } from "zod";
import "zod-openapi/extend";

import { selectTransferRequestSchema } from "../db/schema/transfer-requests";

// =============================================================================
// Input Schemas - Used for validating request payloads
// =============================================================================

/**
 * Schema for creating a transfer request
 */
export const zCreateTransferRequestSchema = z.object({
  vehicleUUID: z.string().uuid(),
  toUserEmail: z.string().email(),
  message: z.string().optional(),
});

export type CreateTransferRequestSchema = z.infer<typeof zCreateTransferRequestSchema>;

/**
 * Schema for responding to a transfer request
 */
export const zRespondToTransferRequestSchema = z.object({
  action: z.enum(["accept", "reject"]),
});

export type RespondToTransferRequestSchema = z.infer<typeof zRespondToTransferRequestSchema>;

// =============================================================================
// Response Schemas
// =============================================================================

/**
 * Schema for transfer request creation response
 */
export const zTransferRequestCreateResponseSchema = z.object({
  transferRequest: selectTransferRequestSchema,
  message: z.string().openapi({ example: "Transfer request sent. The recipient will be notified shortly." }),
});

export type TransferRequestCreateResponse = z.infer<typeof zTransferRequestCreateResponseSchema>;

/**
 * Schema for transfer requests list response
 */
export const zTransferRequestsListResponseSchema = z.object({
  sent: z.array(selectTransferRequestSchema),
  received: z.array(selectTransferRequestSchema),
});

export type TransferRequestsListResponse = z.infer<typeof zTransferRequestsListResponseSchema>;

/**
 * Schema for transfer request response (accept/reject)
 */
export const zTransferRequestResponseSchema = z.object({
  message: z.string().openapi({ example: "Transfer request accepted successfully" }),
  transferRequest: selectTransferRequestSchema,
});

export type TransferRequestResponseSchemaType = z.infer<typeof zTransferRequestResponseSchema>;

/**
 * Schema for transfer request cancellation response
 */
export const zTransferRequestCancelResponseSchema = z.object({
  message: z.string().openapi({ example: "Transfer request cancelled successfully" }),
  transferRequest: selectTransferRequestSchema,
});

export type TransferRequestCancelResponse = z.infer<typeof zTransferRequestCancelResponseSchema>;

/**
 * Schema for vehicle transfer history response
 */
export const zVehicleTransferHistoryResponseSchema = z.object({
  vehicle: z.object({
    uuid: z.string().uuid(),
    make: z.string(),
    model: z.string(),
    year: z.number(),
    vin: z.string(),
  }),
  transferHistory: z.array(z.object({
    uuid: z.string().uuid(),
    vehicleUUID: z.string().uuid(),
    fromUserId: z.string(),
    toUserId: z.string(),
    fromUserName: z.string(),
    fromUserEmail: z.string().email(),
    toUserName: z.string(),
    toUserEmail: z.string().email(),
    transferredAt: z.string(),
  })),
  pendingRequests: z.array(selectTransferRequestSchema),
});

export type VehicleTransferHistoryResponse = z.infer<typeof zVehicleTransferHistoryResponseSchema>;
