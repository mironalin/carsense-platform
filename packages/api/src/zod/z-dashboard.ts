import { z } from "zod";
import "zod-openapi/extend";

// =============================================================================
// Dashboard Component Schemas
// =============================================================================

/**
 * Schema for vehicle status section
 */
export const zVehicleStatusSchema = z.object({
  vehicleUUID: z.string().openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
  make: z.string().openapi({ example: "Toyota" }),
  model: z.string().openapi({ example: "Camry" }),
  year: z.number().openapi({ example: 2022 }),
  vin: z.string().nullable().openapi({ example: "1HGBH41JXMN109186" }),
  latestOdometer: z.number().nullable().openapi({ example: 25000 }),
  lastDiagnosticDate: z.string().nullable().openapi({ example: "2024-01-15T10:30:00Z" }),
  daysSinceLastDiagnostic: z.number().nullable().openapi({ example: 5 }),
  activeDTCsCount: z.number().openapi({ example: 2 }),
  totalDiagnosticsCount: z.number().openapi({ example: 15 }),
});

export type VehicleStatusSchema = z.infer<typeof zVehicleStatusSchema>;

/**
 * Schema for quick statistics section
 */
export const zQuickStatsSchema = z.object({
  totalDiagnostics: z.number().openapi({ example: 15 }),
  totalMaintenance: z.number().openapi({ example: 8 }),
  totalNotifications: z.number().openapi({ example: 3 }),
  activeDTCs: z.number().openapi({ example: 2 }),
  maintenanceCostYTD: z.number().openapi({ example: 1250.50 }),
  averageDiagnosticInterval: z.number().nullable().openapi({ example: 7.5 }),
});

export type QuickStatsSchema = z.infer<typeof zQuickStatsSchema>;

/**
 * Schema for recent activity items
 */
export const zRecentActivitySchema = z.object({
  type: z.enum(["diagnostic", "maintenance", "dtc", "notification"]).openapi({
    example: "diagnostic",
  }),
  id: z.string().openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
  title: z.string().openapi({ example: "Diagnostic Session" }),
  description: z.string().nullable().openapi({ example: "Odometer: 25000" }),
  date: z.string().openapi({ example: "2024-01-15T10:30:00Z" }),
  severity: z.enum(["low", "medium", "high"]).optional().openapi({ example: "medium" }),
});

export type RecentActivitySchema = z.infer<typeof zRecentActivitySchema>;

/**
 * Schema for health trend data points
 */
export const zHealthTrendSchema = z.object({
  date: z.string().openapi({ example: "2024-01-15" }),
  diagnosticsCount: z.number().openapi({ example: 2 }),
  dtcsCount: z.number().openapi({ example: 1 }),
  maintenanceCount: z.number().openapi({ example: 0 }),
  avgSensorValue: z.number().nullable().openapi({ example: 85.5 }),
});

export type HealthTrendSchema = z.infer<typeof zHealthTrendSchema>;

// =============================================================================
// Main Dashboard Response Schema
// =============================================================================

/**
 * Schema for complete dashboard overview response
 */
export const zDashboardOverviewSchema = z.object({
  vehicleStatus: zVehicleStatusSchema,
  quickStats: zQuickStatsSchema,
  recentActivity: z.array(zRecentActivitySchema),
  healthTrends: z.array(zHealthTrendSchema),
});

export type DashboardOverviewSchema = z.infer<typeof zDashboardOverviewSchema>;
