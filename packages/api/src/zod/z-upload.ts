import { z } from "zod";
import "zod-openapi/extend";

// =============================================================================
// Input Schemas - Used for validating request payloads
// =============================================================================

/**
 * Schema for image upload requests
 */
export const zImageUploadSchema = z.object({
  image: z.string()
    .min(1, "Image data is required")
    .regex(/^data:image\/(jpeg|jpg|png|gif|webp);base64,/, "Invalid image format. Must be a base64 encoded image.")
    .openapi({ 
      example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...",
      description: "Base64 encoded image data with data URL prefix"
    }),
  filename: z.string()
    .optional()
    .openapi({ 
      example: "profile-picture.jpg",
      description: "Optional filename for the uploaded image"
    }),
}).openapi({ ref: "ImageUploadRequest" });

/**
 * Schema for image deletion requests
 */
export const zImageDeleteSchema = z.object({
  imageUrl: z.string()
    .url("Invalid image URL")
    .openapi({ 
      example: "https://pub-example.r2.dev/profile-images/user123/1234567890-abc123.jpg",
      description: "URL of the image to delete"
    }),
}).openapi({ ref: "ImageDeleteRequest" });

// =============================================================================
// Response Schemas - Used for API responses
// =============================================================================

/**
 * Schema for successful image upload response
 */
export const zImageUploadResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  imageUrl: z.string().url().openapi({ 
    example: "https://pub-example.r2.dev/profile-images/user123/1234567890-abc123.jpg",
    description: "Public URL of the uploaded image"
  }),
  message: z.string().openapi({ example: "Image uploaded successfully" }),
}).openapi({ ref: "ImageUploadResponse" });

/**
 * Schema for successful image deletion response
 */
export const zImageDeleteResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "Image deleted successfully" }),
}).openapi({ ref: "ImageDeleteResponse" });

/**
 * Schema for upload error responses with details
 */
export const zUploadErrorResponseSchema = z.object({
  error: z.string().openapi({ example: "Invalid request data" }),
  details: z.union([
    z.string(),
    z.array(z.object({
      code: z.string(),
      message: z.string(),
      path: z.array(z.union([z.string(), z.number()])),
    }))
  ]).optional().openapi({ 
    description: "Additional error details, may include validation errors"
  }),
}).openapi({ ref: "UploadErrorResponse" }); 