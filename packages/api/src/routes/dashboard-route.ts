import { and, count, desc, eq, gte, inArray, isNull, sql } from "drizzle-orm";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver, validator as zValidator } from "hono-openapi/zod";
import { z } from "zod";

import { unauthorizedResponseObject, vehicleNotFoundResponseObject } from "@/zod/z-api-responses";

import type { AppBindings } from "../lib/types";

import { db } from "../db";
import { diagnosticsDTCTable } from "../db/schema/diagnostics-dtc-schema";
import { diagnosticsTable } from "../db/schema/diagnostics-schema";
import { DTCLibraryTable } from "../db/schema/dtc-library-schema";
import { maintenanceLogTable } from "../db/schema/maintenance-log-schema";
import { notificationsTable } from "../db/schema/notifications";
import { vehiclesTable } from "../db/schema/vehicles-schema";
import { getSessionAndUser } from "../middleware/get-session-and-user";
import { zDashboardOverviewSchema } from "../zod/z-dashboard";

export const dashboardRoute = new Hono<AppBindings>()
  .use(getSessionAndUser)
  .get(
    "/:vehicleUUID/overview",
    describeRoute({
      tags: ["Dashboard"],
      summary: "Get dashboard overview for a vehicle",
      description: "Get comprehensive dashboard data including vehicle status, stats, recent activity, and health trends",
      responses: {
        200: {
          description: "OK",
          content: {
            "application/json": {
              schema: resolver(zDashboardOverviewSchema),
            },
          },
        },
        401: unauthorizedResponseObject,
        404: vehicleNotFoundResponseObject,
      },
    }),
    zValidator("param", z.object({
      vehicleUUID: z.string().uuid(),
    })),
    async (c) => {
      const user = c.get("user");
      const logger = c.get("logger");

      if (!user) {
        logger.warn("Unauthorized access attempt - dashboard overview");
        return c.json({ error: "Unauthorized" }, 401);
      }

      const vehicleUUID = c.req.param("vehicleUUID");

      // Verify vehicle ownership
      const vehicle = await db
        .select()
        .from(vehiclesTable)
        .where(
          and(
            eq(vehiclesTable.uuid, vehicleUUID),
            user.role === "user" ? eq(vehiclesTable.ownerId, user.id) : undefined,
            isNull(vehiclesTable.deletedAt),
          ),
        )
        .then(res => res[0]);

      if (!vehicle) {
        logger.warn("Vehicle not found or unauthorized access");
        return c.json({ error: "Vehicle not found" }, 404);
      }

      // Get date ranges
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const yearStart = new Date(now.getFullYear(), 0, 1);

      // Get latest diagnostic info
      const latestDiagnostic = await db
        .select()
        .from(diagnosticsTable)
        .where(eq(diagnosticsTable.vehicleUUID, vehicleUUID))
        .orderBy(desc(diagnosticsTable.createdAt))
        .limit(1)
        .then(res => res[0]);

      // Calculate days since last diagnostic
      const daysSinceLastDiagnostic = latestDiagnostic
        ? Math.floor((now.getTime() - new Date(latestDiagnostic.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        : null;

      // Get total diagnostics count
      const totalDiagnosticsCount = await db
        .select({ count: count() })
        .from(diagnosticsTable)
        .where(eq(diagnosticsTable.vehicleUUID, vehicleUUID))
        .then(res => res[0]?.count || 0);

      // Get active DTCs count (from most recent diagnostic)
      const activeDTCsCount = latestDiagnostic
        ? await db
          .select({ count: count() })
          .from(diagnosticsDTCTable)
          .where(eq(diagnosticsDTCTable.diagnosticUUID, latestDiagnostic.uuid))
          .then(res => res[0]?.count || 0)
        : 0;

      // Vehicle Status
      const vehicleStatus = {
        vehicleUUID: vehicle.uuid,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        vin: vehicle.vin,
        latestOdometer: latestDiagnostic?.odometer || null,
        lastDiagnosticDate: latestDiagnostic?.createdAt.toISOString() || null,
        daysSinceLastDiagnostic,
        activeDTCsCount,
        totalDiagnosticsCount,
      };

      // Quick Stats
      const maintenanceCount = await db
        .select({ count: count() })
        .from(maintenanceLogTable)
        .where(eq(maintenanceLogTable.vehicleUUID, vehicleUUID))
        .then(res => res[0]?.count || 0);

      const notificationsCount = await db
        .select({ count: count() })
        .from(notificationsTable)
        .where(eq(notificationsTable.userId, user.id))
        .then(res => res[0]?.count || 0);

      const maintenanceCostYTD = await db
        .select({
          totalCost: sql<number>`COALESCE(SUM(${maintenanceLogTable.cost}), 0)`,
        })
        .from(maintenanceLogTable)
        .where(
          and(
            eq(maintenanceLogTable.vehicleUUID, vehicleUUID),
            gte(maintenanceLogTable.serviceDate, yearStart),
          ),
        )
        .then(res => res[0]?.totalCost || 0);

      const quickStats = {
        totalDiagnostics: totalDiagnosticsCount,
        totalMaintenance: maintenanceCount,
        totalNotifications: notificationsCount,
        activeDTCs: activeDTCsCount,
        maintenanceCostYTD,
        averageDiagnosticInterval: null, // Will calculate later if needed
      };

      // Recent Activity (last 10 items)
      const recentDiagnostics = await db
        .select({
          id: diagnosticsTable.uuid,
          date: diagnosticsTable.createdAt,
          odometer: diagnosticsTable.odometer,
          notes: diagnosticsTable.notes,
        })
        .from(diagnosticsTable)
        .where(eq(diagnosticsTable.vehicleUUID, vehicleUUID))
        .orderBy(desc(diagnosticsTable.createdAt))
        .limit(5);

      const recentMaintenance = await db
        .select({
          id: maintenanceLogTable.uuid,
          date: maintenanceLogTable.serviceDate,
          cost: maintenanceLogTable.cost,
          notes: maintenanceLogTable.notes,
        })
        .from(maintenanceLogTable)
        .where(eq(maintenanceLogTable.vehicleUUID, vehicleUUID))
        .orderBy(desc(maintenanceLogTable.serviceDate))
        .limit(5);

      const recentActivity = [
        ...recentDiagnostics.map(d => ({
          type: "diagnostic" as const,
          id: d.id,
          title: "Diagnostic Session",
          description: d.notes || `Odometer: ${d.odometer}`,
          date: d.date.toISOString(),
          severity: "medium" as const,
        })),
        ...recentMaintenance.map(m => ({
          type: "maintenance" as const,
          id: m.id,
          title: "Maintenance Service",
          description: m.notes || `Cost: $${m.cost}`,
          date: m.date.toISOString(),
          severity: "low" as const,
        })),
      ]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);

      // Health Trends (last 30 days) - Meaningful vehicle health insights

      // Get DTC trends with severity analysis
      const dtcTrends = await db
        .select({
          date: sql<string>`DATE(${diagnosticsTable.createdAt})`,
          totalDTCs: count(diagnosticsDTCTable.uuid),
          avgSeverity: sql<number>`AVG(CASE 
            WHEN ${DTCLibraryTable.severity} = 'high' THEN 3
            WHEN ${DTCLibraryTable.severity} = 'medium' THEN 2
            WHEN ${DTCLibraryTable.severity} = 'low' THEN 1
            ELSE 0 END)`,
        })
        .from(diagnosticsTable)
        .leftJoin(diagnosticsDTCTable, eq(diagnosticsDTCTable.diagnosticUUID, diagnosticsTable.uuid))
        .leftJoin(DTCLibraryTable, eq(DTCLibraryTable.code, diagnosticsDTCTable.code))
        .where(
          and(
            eq(diagnosticsTable.vehicleUUID, vehicleUUID),
            gte(diagnosticsTable.createdAt, thirtyDaysAgo),
          ),
        )
        .groupBy(sql`DATE(${diagnosticsTable.createdAt})`)
        .orderBy(sql`DATE(${diagnosticsTable.createdAt})`);

      // Get maintenance cost trends
      const maintenanceCostTrends = await db
        .select({
          date: sql<string>`DATE(${maintenanceLogTable.serviceDate})`,
          totalCost: sql<number>`SUM(${maintenanceLogTable.cost})`,
          maintenanceCount: count(maintenanceLogTable.uuid),
        })
        .from(maintenanceLogTable)
        .where(
          and(
            eq(maintenanceLogTable.vehicleUUID, vehicleUUID),
            gte(maintenanceLogTable.serviceDate, thirtyDaysAgo),
          ),
        )
        .groupBy(sql`DATE(${maintenanceLogTable.serviceDate})`)
        .orderBy(sql`DATE(${maintenanceLogTable.serviceDate})`);

      // Get odometer progression (vehicle usage patterns)
      const odometerTrends = await db
        .select({
          date: sql<string>`DATE(${diagnosticsTable.createdAt})`,
          maxOdometer: sql<number>`MAX(${diagnosticsTable.odometer})`,
          minOdometer: sql<number>`MIN(${diagnosticsTable.odometer})`,
        })
        .from(diagnosticsTable)
        .where(
          and(
            eq(diagnosticsTable.vehicleUUID, vehicleUUID),
            gte(diagnosticsTable.createdAt, thirtyDaysAgo),
          ),
        )
        .groupBy(sql`DATE(${diagnosticsTable.createdAt})`)
        .orderBy(sql`DATE(${diagnosticsTable.createdAt})`);

      // Create a comprehensive date range for the last 30 days
      const dateRange: string[] = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        dateRange.push(date.toISOString().split("T")[0]);
      }

      // Calculate cumulative odometer progression
      let cumulativeOdometer = 0;
      const odometerProgression = dateRange.map((date) => {
        const dayData = odometerTrends.find(t => t.date === date);
        if (dayData && dayData.maxOdometer) {
          cumulativeOdometer = Math.max(cumulativeOdometer, dayData.maxOdometer);
        }
        return { date, odometer: cumulativeOdometer };
      });

      // Calculate comprehensive health score factors
      // Health Score (0-100): A holistic measure of vehicle health considering multiple factors
      // Higher score = better health. Factors include:
      // - DTC severity and frequency (major impact)
      // - Maintenance patterns (excessive = problems, proactive = good)
      // - Diagnostic frequency (too many = issues)
      // - Maintenance neglect (long gaps without diagnostics)
      // - Proactive maintenance bonus (maintenance without DTCs)
      const calculateHealthScore = (date: string, dtcData: any, maintenanceData: any, _odometerData: any, _dayIndex: number) => {
        let healthScore = 100; // Start with perfect health

        // Factor 1: DTC Impact (0-40 points deduction)
        if (dtcData?.avgSeverity && dtcData.totalDTCs > 0) {
          const dtcImpact = Math.min(40, (dtcData.avgSeverity * dtcData.totalDTCs * 8));
          healthScore -= dtcImpact;
        }

        // Factor 2: Maintenance Frequency (0-20 points deduction)
        // Recent maintenance is good, but excessive maintenance indicates problems
        const maintenanceFrequency = maintenanceData?.maintenanceCount || 0;
        if (maintenanceFrequency > 2) {
          // More than 2 maintenance events in a day suggests serious issues
          healthScore -= Math.min(20, (maintenanceFrequency - 2) * 10);
        }

        // Factor 3: Diagnostic Frequency (0-15 points deduction)
        // Too many diagnostics might indicate ongoing issues
        const recentDiagnostics = dtcTrends.filter((d) => {
          const daysDiff = Math.abs(new Date(date).getTime() - new Date(d.date).getTime()) / (1000 * 60 * 60 * 24);
          return daysDiff <= 7; // Within last 7 days
        }).length;

        if (recentDiagnostics > 3) {
          healthScore -= Math.min(15, (recentDiagnostics - 3) * 3);
        }

        // Factor 4: Time Since Last Diagnostic (0-10 points deduction)
        // Long gaps without diagnostics might indicate neglect
        if (daysSinceLastDiagnostic && daysSinceLastDiagnostic > 90) {
          const neglectPenalty = Math.min(10, (daysSinceLastDiagnostic - 90) / 30 * 2);
          healthScore -= neglectPenalty;
        }

        // Factor 5: Maintenance vs Problems Ratio (0-15 points adjustment)
        // Good maintenance should boost health score
        const totalMaintenanceRecent = maintenanceCostTrends
          .filter(m => new Date(m.date) >= new Date(date))
          .reduce((sum, m) => sum + (m.maintenanceCount || 0), 0);

        const totalDTCsRecent = dtcTrends
          .filter(d => new Date(d.date) >= new Date(date))
          .reduce((sum, d) => sum + (d.totalDTCs || 0), 0);

        if (totalMaintenanceRecent > 0 && totalDTCsRecent === 0) {
          // Proactive maintenance with no issues = health boost
          healthScore += Math.min(10, totalMaintenanceRecent * 2);
        }

        // Ensure score stays within bounds
        return Math.max(0, Math.min(100, Math.round(healthScore)));
      };

      // Merge all trends data with meaningful health insights
      const healthTrendsFormatted = dateRange.map((date, index) => {
        const dtcData = dtcTrends.find(t => t.date === date);
        const maintenanceData = maintenanceCostTrends.find(t => t.date === date);
        const odometerData = odometerProgression.find(t => t.date === date);

        return {
          date,
          // Comprehensive Health Score (0-100): Higher is better
          healthScore: calculateHealthScore(date, dtcData, maintenanceData, odometerData, index),
          // DTC count for the day
          dtcsCount: dtcData?.totalDTCs || 0,
          // Maintenance cost for the day
          maintenanceCost: maintenanceData?.totalCost || 0,
          // Cumulative odometer reading
          odometerReading: odometerData?.odometer || 0,
          // Daily mileage (difference from previous day)
          dailyMileage: 0, // Will be calculated below
        };
      });

      // Calculate daily mileage
      for (let i = 1; i < healthTrendsFormatted.length; i++) {
        const today = healthTrendsFormatted[i];
        const yesterday = healthTrendsFormatted[i - 1];
        today.dailyMileage = Math.max(0, today.odometerReading - yesterday.odometerReading);
      }

      logger.debug({ vehicleUUID }, "Dashboard overview fetched");

      return c.json({
        vehicleStatus,
        quickStats,
        recentActivity,
        healthTrends: healthTrendsFormatted,
      });
    },
  );
