import { resolver } from "hono-openapi/zod";
import { z } from "zod";

// Common error response schemas
export const zErrorResponse = z.object({
  error: z.string(),
});

// Specific error responses with examples
export const zUnauthorizedResponse = z.object({
  error: z.string().openapi({ example: "Unauthorized" }),
});

export const zNotFoundResponse = z.object({
  error: z.string().openapi({ example: "Not found" }),
});

export const zVehicleNotFoundResponse = z.object({
  error: z.string().openapi({ example: "Vehicle not found" }),
});

// Standard response objects for OpenAPI docs
export const unauthorizedResponseObject = {
  description: "Unauthorized",
  content: {
    "application/json": {
      schema: resolver(zUnauthorizedResponse),
    },
  },
};

export const notFoundResponseObject = {
  description: "Not found",
  content: {
    "application/json": {
      schema: resolver(zNotFoundResponse),
    },
  },
};

export const vehicleNotFoundResponseObject = {
  description: "Vehicle not found",
  content: {
    "application/json": {
      schema: resolver(zVehicleNotFoundResponse),
    },
  },
};
