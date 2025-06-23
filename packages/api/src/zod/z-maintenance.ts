import { z } from "zod";

import { selectMaintenanceLogSchema, serviceTypeEnum } from "../db/schema/maintenance-log-schema";

// Create maintenance entry request schema
export const zCreateMaintenanceEntrySchema = z.object({
  vehicleUUID: z.string().uuid(),
  serviceWorkshopUUID: z.string().uuid().optional(),
  customServiceWorkshopName: z.string().optional(),
  serviceDate: z.string().datetime(),
  serviceTypes: z.array(z.enum(serviceTypeEnum.enumValues)).min(1, "At least one service type is required"),
  odometer: z.number().int().positive().optional(),
  cost: z.number().optional(),
  notes: z.string().optional(),
}).refine(
  data => data.serviceWorkshopUUID || data.customServiceWorkshopName,
  {
    message: "Either serviceWorkshopUUID or customServiceWorkshopName must be provided",
    path: ["serviceWorkshopUUID"],
  },
);

// Response schemas
export const zMaintenanceEntryResponseSchema = z.object({
  maintenanceEntry: selectMaintenanceLogSchema,
  message: z.string(),
});

export const zMaintenanceHistoryItemSchema = selectMaintenanceLogSchema.extend({
  serviceTypes: z.array(z.enum(serviceTypeEnum.enumValues)),
  workshop: z.object({
    uuid: z.string().uuid(),
    name: z.string(),
    phone: z.string().nullable(),
    email: z.string().nullable(),
    website: z.string().nullable(),
  }).nullable(),
});

export const zMaintenanceSummarySchema = z.object({
  totalEntries: z.number(),
  totalCost: z.number(),
  serviceTypeCounts: z.record(z.string(), z.number()),
  mostCommonService: z.object({
    type: z.enum(serviceTypeEnum.enumValues),
    count: z.number(),
  }).nullable(),
  lastService: z.object({
    uuid: z.string().uuid(),
    serviceDate: z.string(),
    serviceTypes: z.array(z.enum(serviceTypeEnum.enumValues)),
    cost: z.number().nullable(),
  }).nullable(),
});

export const zMaintenanceHistoryResponseSchema = z.object({
  maintenanceHistory: z.array(zMaintenanceHistoryItemSchema),
  summary: zMaintenanceSummarySchema,
  vehicleInfo: z.object({
    uuid: z.string().uuid(),
    make: z.string(),
    model: z.string(),
    year: z.number(),
    licensePlate: z.string(),
  }),
});

export const zDeleteMaintenanceEntryResponseSchema = z.object({
  message: z.string(),
});
