import { z } from "zod";
import "zod-openapi/extend";

// =============================================================================
// ML Models Schemas
// =============================================================================

/**
 * Schema for ML model details, matching MLModelResponse from the ML service.
 */
export const zMLModelSchema = z.object({
  id: z.number().openapi({ description: "Model ID" }),
  name: z.string().openapi({ description: "Model name" }),
  version: z.string().openapi({ description: "Model version" }),
  description: z.string().optional().openapi({ description: "Model description" }),
  framework: z.string().openapi({ description: "ML framework used (e.g., 'tensorflow', 'pytorch', 'sklearn')" }),
  vehicle_make: z.string().optional().openapi({ description: "Vehicle make if model is make-specific" }),
  model_type: z.string().openapi({ description: "Model type (e.g., 'classification', 'regression')" }),
  trained_at: z.string().datetime().openapi({ description: "Training timestamp" }),
  metrics: z.record(z.string(), z.number()).openapi({ description: "Model performance metrics" }),
  input_features: z.array(z.string()).openapi({ description: "List of features the model expects" }),
  created_at: z.string().datetime().openapi({ description: "Creation timestamp" }),
  updated_at: z.string().datetime().openapi({ description: "Last update timestamp" }),
});

export type MLModel = z.infer<typeof zMLModelSchema>;

/**
 * Schema for ML models list response
 */
export const zMLModelsListResponseSchema = z.object({
  models: z.array(zMLModelSchema),
});

export type MLModelsListResponse = z.infer<typeof zMLModelsListResponseSchema>;

// =============================================================================
// Generic/Basic ML Predictions Schemas
// (These are for the generic POST / endpoint, assuming they are still needed)
// =============================================================================

/**
 * Schema for basic prediction requests
 */
export const zBasicPredictionRequestSchema = z.object({
  model_id: z.number(),
  vehicle_id: z.number(),
  input_data: z.record(z.string(), z.any()),
  results: z.record(z.string(), z.any()), // This seems like it should be part of response, not request
  confidence: z.number(), // This also seems like it should be part of response
});

export type BasicPredictionRequest = z.infer<typeof zBasicPredictionRequestSchema>;

/**
 * Schema for basic prediction responses
 */
export const zBasicPredictionResponseSchema = z.object({
  id: z.number(),
  model_id: z.number(),
  vehicle_id: z.number(),
  prediction_date: z.string().datetime(),
  input_data: z.record(z.string(), z.any()),
  results: z.record(z.string(), z.any()),
  confidence: z.number(),
  feedback: z.record(z.string(), z.any()).optional(),
});

export type BasicPredictionResponse = z.infer<typeof zBasicPredictionResponseSchema>;


// =============================================================================
// Detailed Vehicle Health Prediction Schemas (NEW/UPDATED)
// =============================================================================

/**
 * Schema for vehicle information, part of the detailed prediction request.
 */
export const zVehicleInfoSchema = z.object({
  make: z.string().openapi({ description: "Vehicle manufacturer (e.g., 'Dacia', 'Volkswagen')" }),
  model: z.string().openapi({ description: "Vehicle model (e.g., 'Logan', 'Golf')" }),
  year: z.number().int().openapi({ description: "Manufacturing year" }),
  vin: z.string().optional().openapi({ description: "Vehicle Identification Number" }),
  engineType: z.string().openapi({ description: "Engine type (e.g., 'diesel', 'gasoline')" }),
  fuelType: z.string().openapi({ description: "Fuel type" }),
  transmissionType: z.string().optional().openapi({ description: "Transmission type" }),
  mileage: z.number().int().optional().openapi({ description: "Current vehicle mileage in kilometers" }),
});
export type VehicleInfo = z.infer<typeof zVehicleInfoSchema>;

/**
 * Schema for individual sensor reading with units.
 */
export const zSensorReadingSchema = z.object({
  pid: z.string().openapi({ description: "Parameter ID (e.g., 'rpm', 'coolant_temp')" }),
  value: z.number().openapi({ description: "Sensor value" }),
  unit: z.string().openapi({ description: "Unit of measurement (e.g., 'RPM', '°C')" }),
});
export type SensorReading = z.infer<typeof zSensorReadingSchema>;

/**
 * Schema for detailed vehicle health prediction requests.
 * This replaces the previous simpler zVehicleHealthPredictionRequestSchema.
 */
export const zVehicleHealthPredictionRequestSchema = z.object({
  vehicleInfo: zVehicleInfoSchema.openapi({ description: "Vehicle information" }),
  dtcCodes: z.array(z.string()).default([]).openapi({ description: "List of DTC codes present in the vehicle" }),
  obdParameters: z.record(z.string(), z.number()).default({}).openapi({
    description: "OBD parameters as key-value pairs (e.g., {'rpm': 1200, 'coolant_temp': 90})"
  }),
  sensorReadings: z.array(zSensorReadingSchema).optional().openapi({
    description: "Detailed sensor readings with units"
  }),
  requestTime: z.string().datetime().openapi({ description: "Request timestamp" }),
});
export type VehicleHealthPredictionRequest = z.infer<typeof zVehicleHealthPredictionRequestSchema>;


/**
 * Schema for individual component failure probability.
 */
export const zComponentFailureSchema = z.object({
  component: z.string().openapi({ description: "Vehicle component name" }),
  failureProbability: z.number().openapi({ description: "Probability of failure (0.0 to 1.0)" }),
  timeToFailure: z.number().int().optional().openapi({ description: "Estimated time to failure in days" }),
  confidence: z.number().openapi({ description: "Confidence in the prediction (0.0 to 1.0)" }),
  severity: z.enum(["low", "medium", "high", "critical"]).openapi({ description: "Severity of failure ('low', 'medium', 'high', 'critical')" }),
});
export type ComponentFailure = z.infer<typeof zComponentFailureSchema>;

/**
 * Schema for detailed maintenance recommendation.
 * This replaces the previous simpler zMaintenanceRecommendationSchema.
 */
export const zMaintenanceRecommendationSchema = z.object({
  action: z.string().openapi({ description: "Recommended action" }),
  urgency: z.enum(["routine", "soon", "urgent", "immediate"]).openapi({ description: "Urgency level ('routine', 'soon', 'urgent', 'immediate')" }),
  component: z.string().openapi({ description: "Target component" }),
  estimatedCost: z.object({
    min: z.number(),
    max: z.number(),
    currency: z.string(),
  }).optional().openapi({ description: "Min/max cost estimate, e.g. {'min': 100, 'max': 200, 'currency': 'USD'}" }),
  description: z.string().openapi({ description: "Detailed description of the recommendation" }),
});
export type MaintenanceRecommendation = z.infer<typeof zMaintenanceRecommendationSchema>;

/**
 * Schema for the 'predictions' part of the detailed response.
 */
export const zPredictionResultSchema = z.object({
  vehicleHealthScore: z.number().openapi({ description: "Overall vehicle health score (0-100)" }),
  componentFailures: z.array(zComponentFailureSchema).openapi({ description: "Component failure probabilities" }),
  maintenanceRecommendations: z.array(zMaintenanceRecommendationSchema).openapi({ description: "Maintenance recommendations" }),
  overallUrgency: z.enum(["low", "medium", "high", "critical"]).openapi({ description: "Overall urgency level ('low', 'medium', 'high', 'critical')" }),
});
export type PredictionResult = z.infer<typeof zPredictionResultSchema>;

/**
 * Schema for detailed vehicle health prediction responses.
 * This replaces the previous simpler zVehicleHealthPredictionResponseSchema.
 */
export const zVehicleHealthPredictionResponseSchema = z.object({
  requestId: z.string().openapi({ description: "Unique request identifier" }),
  predictions: zPredictionResultSchema.openapi({ description: "Prediction results" }),
  modelInfo: z.record(z.union([z.string(), z.number()])).openapi({ description: "Information about the model used (key-value pairs)" }),
  processedAt: z.string().datetime().openapi({ description: "Processing timestamp" }),
});
export type VehicleHealthPredictionResponse = z.infer<typeof zVehicleHealthPredictionResponseSchema>;


// =============================================================================
// Prediction Feedback Schema
// (This remains as is, assuming it's still relevant)
// =============================================================================

/**
 * Schema for prediction feedback
 */
export const zPredictionFeedbackSchema = z.object({
  accuracy: z.number().min(0).max(100).optional(),
  comments: z.string().optional(),
  isActionable: z.boolean().optional(),
  additionalData: z.record(z.string(), z.any()).optional(),
});

export type PredictionFeedback = z.infer<typeof zPredictionFeedbackSchema>;

// The old zComponentFailureProbabilitySchema is removed as it's superseded by zComponentFailureSchema within an array.