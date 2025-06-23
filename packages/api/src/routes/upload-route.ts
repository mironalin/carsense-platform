import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver, validator as zValidator } from "hono-openapi/zod";
import { z } from "zod";

import type { AppBindings } from "../lib/types";
import { getSessionAndUser } from "../middleware/get-session-and-user";
import { 
  badRequestResponseObject, 
  unauthorizedResponseObject 
} from "../zod/z-api-responses";
import {
  zImageDeleteResponseSchema,
  zImageDeleteSchema,
  zImageUploadResponseSchema,
  zImageUploadSchema,
  zUploadErrorResponseSchema,
} from "../zod/z-upload";
import env from "../../env";

/**
 * Get the appropriate R2 public URL based on environment
 */
function getR2PublicUrl(c: any): string {
  // In development, prefer dev URL if available, otherwise fall back to prod URL
  if (env.NODE_ENV === "development") {
    return c.env.R2_DEV_PUBLIC_URL || c.env.R2_PUBLIC_URL;
  }
  // In production, always use production URL
  return c.env.R2_PUBLIC_URL;
}

export const uploadRoute = new Hono<AppBindings>()
  .use("*", getSessionAndUser)
  .post("/image", describeRoute({
    tags: ["Upload"],
    summary: "Upload an image",
    description: "Upload a base64 encoded image to cloud storage. Supports JPEG, PNG, GIF, and WebP formats with a maximum size of 5MB.",
    responses: {
      200: {
        description: "Image uploaded successfully",
        content: {
          "application/json": {
            schema: resolver(zImageUploadResponseSchema),
          },
        },
      },
      400: {
        description: "Bad Request - Invalid image format or size",
        content: {
          "application/json": {
            schema: resolver(zUploadErrorResponseSchema),
          },
        },
      },
      401: unauthorizedResponseObject,
      500: {
        description: "Internal Server Error",
        content: {
          "application/json": {
            schema: resolver(zUploadErrorResponseSchema),
          },
        },
      },
    },
  }), zValidator("json", zImageUploadSchema), async (c) => {
    const logger = c.get("logger");
    const user = c.get("user");

    logger.info("Image upload endpoint hit", { userId: user?.id });

    if (!user) {
      logger.warn("Unauthorized upload attempt");
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Check if R2 bindings are available
    if (!c.env.R2_BUCKET) {
      logger.error("R2_BUCKET binding not found");
      return c.json({ error: "Storage not configured" }, 500);
    }

    if (!c.env.R2_PUBLIC_URL) {
      logger.error("R2_PUBLIC_URL environment variable not found");
      return c.json({ error: "Storage URL not configured" }, 500);
    }

    logger.info("R2 bindings available", { 
      hasBucket: !!c.env.R2_BUCKET, 
      publicUrl: c.env.R2_PUBLIC_URL 
    });

    try {
      const { image, filename } = c.req.valid("json");

      // Extract image data and type (validation already done by Zod schema)
      const [header, base64Data] = image.split(",");
      const mimeType = header.match(/data:image\/([a-zA-Z]*);base64/)?.[1];

      if (!mimeType) {
        return c.json({ error: "Invalid image format" }, 400);
      }

      // Convert base64 to buffer
      const imageBuffer = Buffer.from(base64Data, "base64");
      
      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (imageBuffer.length > maxSize) {
        return c.json({ error: "Image too large. Max size is 5MB." }, 400);
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const extension = mimeType === "jpeg" ? "jpg" : mimeType;
      const key = `profile-images/${user.id}/${timestamp}-${randomString}.${extension}`;

      // Upload to R2 (Cloudflare Object Storage)
      const uploadResponse = await c.env.R2_BUCKET.put(key, imageBuffer, {
        httpMetadata: {
          contentType: `image/${mimeType}`,
          cacheControl: "public, max-age=31536000", // 1 year cache
        },
        customMetadata: {
          userId: user.id,
          uploadedAt: new Date().toISOString(),
        },
      });

      if (!uploadResponse) {
        throw new Error("Failed to upload to R2");
      }

      // Generate public URL using environment-aware function
      const baseUrl = getR2PublicUrl(c);
      const imageUrl = `${baseUrl}/${key}`;

      logger.info({ 
        userId: user.id, 
        key, 
        size: imageBuffer.length, 
        baseUrl, 
        environment: env.NODE_ENV 
      }, "Image uploaded successfully");

      return c.json({
        success: true,
        imageUrl,
        message: "Image uploaded successfully",
      });

    } catch (error) {
      logger.error({ 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        userId: user?.id 
      }, "Image upload failed");
      
      if (error instanceof z.ZodError) {
        return c.json({ error: "Invalid request data", details: error.errors }, 400);
      }
      
      return c.json({ 
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error)
      }, 500);
    }
  })
  .delete("/image", describeRoute({
    tags: ["Upload"],
    summary: "Delete an image",
    description: "Delete an uploaded image from cloud storage. Only the owner of the image can delete it.",
    responses: {
      200: {
        description: "Image deleted successfully",
        content: {
          "application/json": {
            schema: resolver(zImageDeleteResponseSchema),
          },
        },
      },
      400: badRequestResponseObject,
      401: unauthorizedResponseObject,
      403: {
        description: "Forbidden - Not authorized to delete this image",
        content: {
          "application/json": {
            schema: resolver(zUploadErrorResponseSchema),
          },
        },
      },
      500: {
        description: "Internal Server Error",
        content: {
          "application/json": {
            schema: resolver(zUploadErrorResponseSchema),
          },
        },
      },
    },
  }), zValidator("json", zImageDeleteSchema), async (c) => {
    const logger = c.get("logger");
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const { imageUrl } = c.req.valid("json");
      
      // Check if URL is from either production or development bucket
      const baseUrl = getR2PublicUrl(c);
      const isValidUrl = imageUrl && (
        imageUrl.includes(c.env.R2_PUBLIC_URL) || 
        (c.env.R2_DEV_PUBLIC_URL && imageUrl.includes(c.env.R2_DEV_PUBLIC_URL))
      );
      
      if (!isValidUrl) {
        logger.warn({ imageUrl, baseUrl }, "Invalid image URL for deletion");
        return c.json({ error: "Invalid image URL" }, 400);
      }

      // Extract key from URL (try both URLs)
      let key: string;
      if (c.env.R2_DEV_PUBLIC_URL && imageUrl.includes(c.env.R2_DEV_PUBLIC_URL)) {
        key = imageUrl.replace(`${c.env.R2_DEV_PUBLIC_URL}/`, "");
      } else {
        key = imageUrl.replace(`${c.env.R2_PUBLIC_URL}/`, "");
      }
      
      // Verify the image belongs to the user
      if (!key.startsWith(`profile-images/${user.id}/`)) {
        return c.json({ error: "Unauthorized to delete this image" }, 403);
      }

      // Delete from R2
      await c.env.R2_BUCKET.delete(key);

      logger.info({ userId: user.id, key }, "Image deleted successfully");

      return c.json({
        success: true,
        message: "Image deleted successfully",
      });

    } catch (error) {
      logger.error({ error, userId: user?.id }, "Image deletion failed");
      return c.json({ error: "Internal server error" }, 500);
    }
  }); 