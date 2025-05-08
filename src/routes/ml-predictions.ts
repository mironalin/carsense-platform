import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver, validator as zValidator } from "hono-openapi/zod";
import { z } from "zod";

import type { AppBindings } from "@/lib/types";

import { db } from "@/db";
import { diagnosticsTable } from "@/db/schema/diagnostics-schema";
import { vehiclesTable } from "@/db/schema/vehicles-schema";
import { getSessionAndUser } from "@/middleware/get-session-and-user";
import { notFoundResponseObject, unauthorizedResponseObject } from "@/zod/z-api-responses";
import { generateMLServiceToken } from "@/lib/ml-service-token";
import {
  zBasicPredictionRequestSchema,
  zBasicPredictionResponseSchema,
  zPredictionFeedbackSchema,
  zVehicleHealthPredictionRequestSchema,
  zVehicleHealthPredictionResponseSchema,
  zMLModelsListResponseSchema
} from "@/zod/z-ml";
import env from "../../env";
import { config } from "dotenv";

config({ path: ".env" });

// Define base URL without trailing slash
const ML_SERVICE_BASE_URL = env.ML_SERVICE_URL.endsWith('/')
  ? env.ML_SERVICE_URL.slice(0, -1)
  : env.ML_SERVICE_URL;

export const mlPredictionsRoute = new Hono<AppBindings>()
  .use(getSessionAndUser)
  // 1. Create a new prediction (generic)
  .post("/", describeRoute({
    tags: ["ML Predictions"],
    summary: "Create a new prediction",
    description: "Create a new prediction using a specific ML model",
    responses: {
      201: {
        description: "Created",
        content: {
          "application/json": {
            schema: resolver(zBasicPredictionResponseSchema),
          },
        },
      },
      401: unauthorizedResponseObject,
      404: notFoundResponseObject,
    },
  }), zValidator("json", zBasicPredictionRequestSchema), async (c) => {
    const user = c.get("user");
    const logger = c.get("logger");

    if (!user) {
      logger.warn("Unauthorized access attempt - create prediction");
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Generate an ML service token
    const mlServiceToken = generateMLServiceToken(
      user.id,
      user.role,
      ["create:predictions"]
    );

    try {
      // Make request to ML service
      const response = await fetch(`${ML_SERVICE_BASE_URL}/predictions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${mlServiceToken}`
        },
        body: JSON.stringify(c.req.valid("json"))
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error({ status: response.status, error: errorText }, "ML service error");
        return c.json({
          error: "Error creating prediction",
          details: response.status
        }, response.status as any);
      }

      const prediction = await response.json();
      c.status(201);
      return c.json(prediction);
    } catch (error) {
      logger.error({ error }, "Error creating prediction");
      return c.json({ error: "Failed to create prediction" }, 500);
    }
  })

  // 2. Vehicle health prediction
  .post("/vehicle-health", describeRoute({
    tags: ["ML Predictions"],
    summary: "Get vehicle health prediction",
    description: "Request a prediction of vehicle health based on sensor data and DTCs",
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: resolver(zVehicleHealthPredictionResponseSchema),
          },
        },
      },
      401: unauthorizedResponseObject,
      404: notFoundResponseObject,
    },
  }), zValidator("json", zVehicleHealthPredictionRequestSchema), async (c) => {
    const user = c.get("user");
    const logger = c.get("logger");

    if (!user) {
      logger.warn("Unauthorized access attempt - ML prediction");
      return c.json({ error: "Unauthorized" }, 401);
    }

    const predictionRequest = c.req.valid("json");
    const { vehicleId, diagnosticId, sensorData, dtcCodes } = predictionRequest;

    logger.debug({ vehicleId, diagnosticId, sensorDataCount: Object.keys(sensorData).length },
      "Requesting ML prediction");

    // Verify vehicle ownership if user role is not admin
    if (user.role === "user") {
      const vehicle = await db
        .select()
        .from(vehiclesTable)
        .where(
          and(
            eq(vehiclesTable.id, vehicleId),
            eq(vehiclesTable.ownerId, user.id),
          ),
        )
        .then(res => res[0]);

      if (!vehicle) {
        logger.warn("User not authorized to get predictions for this vehicle");
        return c.json({ error: "Unauthorized to access this vehicle" }, 401);
      }
    }

    // If diagnosticId is provided, verify it exists and belongs to the vehicle
    if (diagnosticId) {
      const diagnostic = await db
        .select()
        .from(diagnosticsTable)
        .where(
          and(
            eq(diagnosticsTable.id, diagnosticId),
            eq(diagnosticsTable.vehicleId, vehicleId),
          ),
        )
        .then(res => res[0]);

      if (!diagnostic) {
        logger.warn("Diagnostic not found or does not belong to vehicle");
        return c.json({ error: "Diagnostic not found" }, 404);
      }
    }

    // Generate an ML service token with appropriate permissions
    const mlServiceToken = generateMLServiceToken(
      user.id,
      user.role,
      ["read:predictions"]
    );

    // Create the ML service request payload
    const mlRequestPayload = {
      vehicleId,
      diagnosticId,
      sensorData,
      dtcCodes: dtcCodes || [],
      userInfo: {
        userId: user.id,
        role: user.role
      }
    };

    try {
      // Make request to ML service
      const response = await fetch(`${ML_SERVICE_BASE_URL}/predictions/vehicle-health`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${mlServiceToken}`
        },
        body: JSON.stringify(mlRequestPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error({ status: response.status, error: errorText }, "ML service error");
        return c.json({
          error: "Error communicating with ML service",
          details: response.status
        }, 500);
      }

      const prediction = await response.json();

      // Log successful prediction
      logger.info({
        vehicleId,
        healthScore: prediction.prediction.vehicleHealthScore,
        recommendationCount: prediction.prediction.maintenanceRecommendations.length
      }, "ML prediction successful");

      return c.json(prediction);
    } catch (error) {
      logger.error({ error }, "Error making prediction request to ML service");
      return c.json({ error: "Failed to get prediction from ML service" }, 500);
    }
  })

  // 3. Get prediction history for a vehicle
  .get("/vehicle/:vehicleId", describeRoute({
    tags: ["ML Predictions"],
    summary: "Get prediction history for a vehicle",
    description: "Retrieve prediction history for a specific vehicle",
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: resolver(z.array(zBasicPredictionResponseSchema)),
          },
        },
      },
      401: unauthorizedResponseObject,
      404: notFoundResponseObject,
    },
  }), zValidator("param", z.object({
    vehicleId: z.string()
      .regex(/^\d+$/, "Vehicle ID must be a number")
      .transform(val => parseInt(val, 10)),
  })), async (c) => {
    const user = c.get("user");
    const logger = c.get("logger");

    if (!user) {
      logger.warn("Unauthorized access attempt - vehicle prediction history");
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { vehicleId } = c.req.valid("param");

    // Verify vehicle ownership if user role is not admin
    if (user.role === "user") {
      const vehicle = await db
        .select()
        .from(vehiclesTable)
        .where(
          and(
            eq(vehiclesTable.id, vehicleId),
            eq(vehiclesTable.ownerId, user.id),
          ),
        )
        .then(res => res[0]);

      if (!vehicle) {
        logger.warn("User not authorized to view predictions for this vehicle");
        return c.json({ error: "Unauthorized to access this vehicle" }, 401);
      }
    }

    // Generate an ML service token with appropriate permissions
    const mlServiceToken = generateMLServiceToken(
      user.id,
      user.role,
      ["read:predictions"]
    );

    try {
      // Make request to ML service
      const response = await fetch(`${ML_SERVICE_BASE_URL}/predictions/vehicle/${vehicleId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${mlServiceToken}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error({ status: response.status, error: errorText }, "ML service error");
        return c.json({
          error: "Error retrieving prediction history",
          details: response.status
        }, response.status as any);
      }

      const predictions = await response.json();
      return c.json(predictions);
    } catch (error) {
      logger.error({ error }, "Error retrieving prediction history");
      return c.json({ error: "Failed to retrieve prediction history" }, 500);
    }
  })

  // 4. Get a specific prediction
  .get("/:predictionId", describeRoute({
    tags: ["ML Predictions"],
    summary: "Get prediction details",
    description: "Get detailed information about a specific prediction",
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: resolver(zBasicPredictionResponseSchema),
          },
        },
      },
      401: unauthorizedResponseObject,
      404: notFoundResponseObject,
    },
  }), zValidator("param", z.object({
    predictionId: z.string()
      .regex(/^\d+$/, "Prediction ID must be a number")
      .transform(val => parseInt(val, 10)),
  })), async (c) => {
    const user = c.get("user");
    const logger = c.get("logger");

    if (!user) {
      logger.warn("Unauthorized access attempt - prediction details");
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { predictionId } = c.req.valid("param");

    // Generate an ML service token with appropriate permissions
    const mlServiceToken = generateMLServiceToken(
      user.id,
      user.role,
      ["read:predictions"]
    );

    try {
      // Make request to ML service
      const response = await fetch(`${ML_SERVICE_BASE_URL}/predictions/${predictionId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${mlServiceToken}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return c.json({ error: "Prediction not found" }, 404);
        }

        const errorText = await response.text();
        logger.error({ status: response.status, error: errorText }, "ML service error");
        return c.json({
          error: "Error retrieving prediction",
          details: response.status
        }, response.status as any);
      }

      const prediction = await response.json();

      // If user role is 'user', verify they own the vehicle
      if (user.role === "user") {
        const vehicle = await db
          .select()
          .from(vehiclesTable)
          .where(
            and(
              eq(vehiclesTable.id, prediction.vehicle_id),
              eq(vehiclesTable.ownerId, user.id),
            ),
          )
          .then(res => res[0]);

        if (!vehicle) {
          logger.warn("User not authorized to view this prediction");
          return c.json({ error: "Unauthorized to access this prediction" }, 401);
        }
      }

      return c.json(prediction);
    } catch (error) {
      logger.error({ error }, "Error retrieving prediction");
      return c.json({ error: "Failed to retrieve prediction" }, 500);
    }
  })

  // 5. Add feedback to a prediction
  .post("/:predictionId/feedback", describeRoute({
    tags: ["ML Predictions"],
    summary: "Add feedback to a prediction",
    description: "Add feedback about the accuracy and usefulness of a prediction",
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: resolver(zBasicPredictionResponseSchema),
          },
        },
      },
      401: unauthorizedResponseObject,
      404: notFoundResponseObject,
    },
  }), zValidator("param", z.object({
    predictionId: z.string()
      .regex(/^\d+$/, "Prediction ID must be a number")
      .transform(val => parseInt(val, 10)),
  })), zValidator("json", zPredictionFeedbackSchema), async (c) => {
    const user = c.get("user");
    const logger = c.get("logger");

    if (!user) {
      logger.warn("Unauthorized access attempt - add prediction feedback");
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { predictionId } = c.req.valid("param");
    const feedback = c.req.valid("json");

    // Generate an ML service token with appropriate permissions
    const mlServiceToken = generateMLServiceToken(
      user.id,
      user.role,
      ["update:predictions"]
    );

    try {
      // Make request to ML service
      const response = await fetch(`${ML_SERVICE_BASE_URL}/predictions/${predictionId}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${mlServiceToken}`
        },
        body: JSON.stringify(feedback)
      });

      if (!response.ok) {
        if (response.status === 404) {
          return c.json({ error: "Prediction not found" }, 404);
        }

        const errorText = await response.text();
        logger.error({ status: response.status, error: errorText }, "ML service error");
        return c.json({
          error: "Error adding feedback",
          details: response.status
        }, response.status as any);
      }

      const updatedPrediction = await response.json();
      logger.info({ predictionId }, "Feedback added successfully");
      return c.json(updatedPrediction);
    } catch (error) {
      logger.error({ error }, "Error adding feedback to prediction");
      return c.json({ error: "Failed to add feedback" }, 500);
    }
  })