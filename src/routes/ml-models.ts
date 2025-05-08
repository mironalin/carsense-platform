import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";

import type { AppBindings } from "@/lib/types";

import { getSessionAndUser } from "@/middleware/get-session-and-user";
import { notFoundResponseObject, unauthorizedResponseObject } from "@/zod/z-api-responses";
import { generateMLServiceToken } from "@/lib/ml-service-token";
import { zMLModelSchema, zMLModelsListResponseSchema } from "@/zod/z-ml";
import env from "../../env";

// Define base URL without trailing slash
const ML_SERVICE_BASE_URL = env.ML_SERVICE_URL.endsWith('/')
  ? env.ML_SERVICE_URL.slice(0, -1)
  : env.ML_SERVICE_URL;

export const mlModelsRoute = new Hono<AppBindings>()
  .use(getSessionAndUser)
  .get("/", describeRoute({
    tags: ["ML Models"],
    summary: "Get available ML models",
    description: "Get a list of available ML models that can be used for predictions",
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: resolver(zMLModelsListResponseSchema),
          },
        },
      },
      401: unauthorizedResponseObject,
    },
  }), async (c) => {
    const user = c.get("user");
    const logger = c.get("logger");

    if (!user) {
      logger.warn("Unauthorized access attempt - ML models list");
      return c.json({ error: "Unauthorized" }, 401);
    }

    logger.debug("Requesting ML models from ML service");

    // Generate ML service token
    const mlServiceToken = generateMLServiceToken(
      user.id,
      user.role,
      ["read:models"]
    );

    try {
      // Explicitly construct the URL to the models endpoint
      const url = `${ML_SERVICE_BASE_URL}/models/`;
      logger.debug({ url }, "Requesting models from ML service");

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${mlServiceToken}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error({ status: response.status, error: errorText, url }, "ML service error");
        return c.json({
          error: "Error communicating with ML service",
          details: response.status
        }, 500);
      }

      const models = await response.json();
      return c.json({ models });
    } catch (error) {
      logger.error({ error }, "Error fetching models from ML service");
      return c.json({ error: "Failed to get models from ML service" }, 500);
    }
  })

  .get("/:modelId", describeRoute({
    tags: ["ML Models"],
    summary: "Get ML model details",
    description: "Get detailed information about a specific ML model",
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: resolver(zMLModelSchema),
          },
        },
      },
      401: unauthorizedResponseObject,
      404: notFoundResponseObject,
    },
  }), async (c) => {
    const user = c.get("user");
    const logger = c.get("logger");
    const modelId = c.req.param("modelId");

    if (!user) {
      logger.warn("Unauthorized access attempt - ML model details");
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Validate modelId is a number
    const modelIdNum = parseInt(modelId, 10);
    if (isNaN(modelIdNum)) {
      return c.json({ error: "Invalid model ID" }, 400);
    }

    // Generate ML service token
    const mlServiceToken = generateMLServiceToken(
      user.id,
      user.role,
      ["read:models"]
    );

    try {
      // Make request to ML service
      const response = await fetch(`${ML_SERVICE_BASE_URL}/models/${modelIdNum}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${mlServiceToken}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return c.json({ error: "Model not found" }, 404);
        }

        const errorText = await response.text();
        logger.error({ status: response.status, error: errorText }, "ML service error");
        return c.json({
          error: "Error communicating with ML service",
          details: response.status
        }, 500);
      }

      const model = await response.json();
      return c.json(model);
    } catch (error) {
      logger.error({ error }, "Error fetching model from ML service");
      return c.json({ error: "Failed to get model from ML service" }, 500);
    }
  });