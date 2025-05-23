import { resolver } from "hono-openapi/zod";
import { z } from "zod";
import "zod-openapi/extend";

// =============================================================================
// Error Response Schemas - Common error schemas for API responses
// =============================================================================

/**
 * Generic error response schema
 */
export const zErrorResponse = z.object({
  error: z.string(),
});

/**
 * Unauthorized error response schema
 */
export const zUnauthorizedResponse = z.object({
  error: z.string().openapi({ example: "Unauthorized" }),
});

/**
 * Not found error response schema
 */
export const zNotFoundResponse = z.object({
  error: z.string().openapi({ example: "Not found" }),
});

/**
 * Vehicle not found error response schema
 */
export const zVehicleNotFoundResponse = z.object({
  error: z.string().openapi({ example: "Vehicle not found" }),
});

/**
 * Bad request error response schema
 */
export const zBadRequestResponse = z.object({
  error: z.string().openapi({ example: "Invalid request parameters" }),
});

// =============================================================================
// OpenAPI Response Objects - Pre-configured response objects for OpenAPI docs
// =============================================================================

/**
 * Unauthorized response object for OpenAPI
 */
export const unauthorizedResponseObject = {
  description: "Unauthorized",
  content: {
    "application/json": {
      schema: resolver(zUnauthorizedResponse),
    },
  },
};

/**
 * Not found response object for OpenAPI
 */
export const notFoundResponseObject = {
  description: "Not found",
  content: {
    "application/json": {
      schema: resolver(zNotFoundResponse),
    },
  },
};

/**
 * Vehicle not found response object for OpenAPI
 */
export const vehicleNotFoundResponseObject = {
  description: "Vehicle not found",
  content: {
    "application/json": {
      schema: resolver(zVehicleNotFoundResponse),
    },
  },
};

/**
 * Bad request response object for OpenAPI
 */
export const badRequestResponseObject = {
  description: "Bad Request",
  content: {
    "application/json": {
      schema: resolver(zBadRequestResponse),
    },
  },
};
