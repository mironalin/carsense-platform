import { and, eq, gt, isNull, or } from "drizzle-orm";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver, validator as zValidator } from "hono-openapi/zod";

import { insertTransferRequestSchema, transferRequestsTable } from "@/db/schema/transfer-requests";

import type { AppBindings } from "../lib/types";

import { db } from "../db";
import { user } from "../db/schema/auth-schema";
import {
  insertNotificationSchema,
  notificationsTable,
} from "../db/schema/notifications";
import {
  insertOwnershipTransferSchema,
  ownershipTransfersTable,
} from "../db/schema/ownership-transfers";
import { vehiclesTable } from "../db/schema/vehicles-schema";
import { getSessionAndUser } from "../middleware/get-session-and-user";
import {
  badRequestResponseObject,
  notFoundResponseObject,
  unauthorizedResponseObject,
} from "../zod/z-api-responses";
import {
  zCreateTransferRequestSchema,
  zRespondToTransferRequestSchema,
  zTransferRequestCancelResponseSchema,
  zTransferRequestCreateResponseSchema,
  zTransferRequestResponseSchema,
  zTransferRequestsListResponseSchema,
  zVehicleTransferHistoryResponseSchema,
} from "../zod/z-ownership-transfers";

export const ownershipTransfersRoute = new Hono<AppBindings>()
  .use(getSessionAndUser)

  // Create a transfer request
  .post(
    "/request",
    describeRoute({
      tags: ["Ownership Transfers"],
      description: "Create a vehicle ownership transfer request",
      summary: "Request vehicle ownership transfer",
      responses: {
        201: {
          description: "Transfer request created",
          content: {
            "application/json": {
              schema: resolver(zTransferRequestCreateResponseSchema),
            },
          },
        },
        400: badRequestResponseObject,
        401: unauthorizedResponseObject,
        404: notFoundResponseObject,
      },
    }),
    zValidator("json", zCreateTransferRequestSchema),
    async (c) => {
      const currentUser = c.get("user");
      const logger = c.get("logger");

      if (!currentUser) {
        logger.warn("Unauthorized transfer request attempt");
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { vehicleUUID, toUserEmail, message } = c.req.valid("json");

      // Verify vehicle ownership
      const vehicle = await db
        .select()
        .from(vehiclesTable)
        .where(
          and(
            eq(vehiclesTable.uuid, vehicleUUID),
            eq(vehiclesTable.ownerId, currentUser.id),
            isNull(vehiclesTable.deletedAt),
          ),
        )
        .then(res => res[0]);

      if (!vehicle) {
        logger.warn({ userId: currentUser.id, vehicleUUID }, "Vehicle not found or not owned");
        return c.json({ error: "Vehicle not found or you don't own this vehicle" }, 404);
      }

      // Check if recipient exists
      const recipientUser = await db
        .select()
        .from(user)
        .where(eq(user.email, toUserEmail))
        .then(res => res[0]);

      // Prevent self-transfer
      if (recipientUser && recipientUser.id === currentUser.id) {
        return c.json({ error: "Cannot transfer vehicle to yourself" }, 400);
      }

      // Check for existing pending transfer for this vehicle
      const existingRequest = await db
        .select()
        .from(transferRequestsTable)
        .where(
          and(
            eq(transferRequestsTable.vehicleUUID, vehicleUUID),
            eq(transferRequestsTable.status, "pending"),
            gt(transferRequestsTable.expiresAt, new Date()),
          ),
        )
        .then(res => res[0]);

      if (existingRequest) {
        return c.json({ error: "A pending transfer request already exists for this vehicle" }, 400);
      }

      // Create transfer request (expires in 7 days)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const transferRequest = insertTransferRequestSchema.parse({
        vehicleUUID,
        fromUserId: currentUser.id,
        toUserEmail,
        toUserId: recipientUser?.id || null,
        message,
        expiresAt,
      });

      const createdRequest = await db
        .insert(transferRequestsTable)
        .values(transferRequest)
        .returning()
        .then(res => res[0]);

      // Create notification for recipient if they exist
      if (recipientUser) {
        const notification = insertNotificationSchema.parse({
          userId: recipientUser.id,
          type: "transfer_request",
          title: "Vehicle Transfer Request",
          message: `${currentUser.name} wants to transfer their ${vehicle.year} ${vehicle.make} ${vehicle.model} to you`,
          data: JSON.stringify({
            transferRequestUUID: createdRequest.uuid,
            vehicleUUID,
            fromUserName: currentUser.name,
            vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
          }),
        });

        await db.insert(notificationsTable).values(notification);
      }

      logger.info({
        transferRequestUUID: createdRequest.uuid,
        fromUserId: currentUser.id,
        toUserEmail,
        vehicleUUID,
      }, "Transfer request created");

      c.status(201);
      return c.json({
        transferRequest: createdRequest,
        message: recipientUser
          ? "Transfer request sent. The recipient will be notified shortly."
          : "Transfer request sent. The recipient will be notified when they create an account.",
      });
    },
  )

  // Get transfer requests (sent and received)
  .get(
    "/",
    describeRoute({
      tags: ["Ownership Transfers"],
      description: "Get transfer requests (sent and received)",
      summary: "Get transfer requests",
      responses: {
        200: {
          description: "Transfer requests retrieved",
          content: {
            "application/json": {
              schema: resolver(zTransferRequestsListResponseSchema),
            },
          },
        },
        401: unauthorizedResponseObject,
      },
    }),
    async (c) => {
      const currentUser = c.get("user");
      const logger = c.get("logger");

      if (!currentUser) {
        logger.warn("Unauthorized transfer requests access");
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Get sent requests
      const sentRequests = await db
        .select()
        .from(transferRequestsTable)
        .where(eq(transferRequestsTable.fromUserId, currentUser.id))
        .orderBy(transferRequestsTable.requestedAt);

      // Get received requests (by email or user ID)
      const receivedRequests = await db
        .select()
        .from(transferRequestsTable)
        .where(
          or(
            eq(transferRequestsTable.toUserId, currentUser.id),
            eq(transferRequestsTable.toUserEmail, currentUser.email),
          ),
        )
        .orderBy(transferRequestsTable.requestedAt);

      return c.json({
        sent: sentRequests,
        received: receivedRequests,
      });
    },
  )

  // Respond to a transfer request
  .patch(
    "/:requestUUID/respond",
    describeRoute({
      tags: ["Ownership Transfers"],
      description: "Accept or reject a transfer request",
      summary: "Respond to transfer request",
      responses: {
        200: {
          description: "Transfer request response processed",
          content: {
            "application/json": {
              schema: resolver(zTransferRequestResponseSchema),
            },
          },
        },
        400: badRequestResponseObject,
        401: unauthorizedResponseObject,
        404: notFoundResponseObject,
      },
    }),
    zValidator("json", zRespondToTransferRequestSchema),
    async (c) => {
      const currentUser = c.get("user");
      const logger = c.get("logger");

      if (!currentUser) {
        logger.warn("Unauthorized transfer response attempt");
        return c.json({ error: "Unauthorized" }, 401);
      }

      const requestUUID = c.req.param("requestUUID");
      const { action } = c.req.valid("json");

      // Get the transfer request
      const transferRequest = await db
        .select()
        .from(transferRequestsTable)
        .where(eq(transferRequestsTable.uuid, requestUUID))
        .then(res => res[0]);

      if (!transferRequest) {
        return c.json({ error: "Transfer request not found" }, 404);
      }

      // Verify this request is for the current user
      if (transferRequest.toUserId !== currentUser.id && transferRequest.toUserEmail !== currentUser.email) {
        logger.warn({
          userId: currentUser.id,
          requestUUID,
        }, "Unauthorized transfer response attempt");
        return c.json({ error: "Unauthorized - this request is not for you" }, 401);
      }

      // Check if already responded or expired
      if (transferRequest.status !== "pending") {
        return c.json({ error: "Transfer request has already been responded to" }, 400);
      }

      if (new Date() > transferRequest.expiresAt) {
        // Auto-expire the request
        await db
          .update(transferRequestsTable)
          .set({ status: "expired", respondedAt: new Date() })
          .where(eq(transferRequestsTable.uuid, requestUUID));

        return c.json({ error: "Transfer request has expired" }, 400);
      }

      const newStatus = action === "accept" ? "accepted" : "rejected";

      // Update request status
      const updatedRequest = await db
        .update(transferRequestsTable)
        .set({
          status: newStatus,
          respondedAt: new Date(),
          toUserId: currentUser.id, // Ensure user ID is set
        })
        .where(eq(transferRequestsTable.uuid, requestUUID))
        .returning()
        .then(res => res[0]);

      if (action === "accept") {
        // Transfer the vehicle ownership
        await db
          .update(vehiclesTable)
          .set({ ownerId: currentUser.id, updatedAt: new Date() })
          .where(eq(vehiclesTable.uuid, transferRequest.vehicleUUID));

        // Create ownership transfer record
        const ownershipTransfer = insertOwnershipTransferSchema.parse({
          vehicleUUID: transferRequest.vehicleUUID,
          fromUserId: transferRequest.fromUserId,
          toUserId: currentUser.id,
        });

        await db.insert(ownershipTransfersTable).values(ownershipTransfer);

        // Notify the original owner
        const notification = insertNotificationSchema.parse({
          userId: transferRequest.fromUserId,
          type: "transfer_accepted",
          title: "Vehicle Transfer Accepted",
          message: `${currentUser.name} has accepted your vehicle transfer request`,
          data: JSON.stringify({
            transferRequestUUID: requestUUID,
            vehicleUUID: transferRequest.vehicleUUID,
            acceptedByName: currentUser.name,
          }),
        });

        await db.insert(notificationsTable).values(notification);

        logger.info({
          transferRequestUUID: requestUUID,
          fromUserId: transferRequest.fromUserId,
          toUserId: currentUser.id,
          vehicleUUID: transferRequest.vehicleUUID,
        }, "Vehicle transfer completed");
      }
      else {
        // Notify the original owner of rejection
        const notification = insertNotificationSchema.parse({
          userId: transferRequest.fromUserId,
          type: "transfer_rejected",
          title: "Vehicle Transfer Rejected",
          message: `${currentUser.name} has rejected your vehicle transfer request`,
          data: JSON.stringify({
            transferRequestUUID: requestUUID,
            vehicleUUID: transferRequest.vehicleUUID,
            rejectedByName: currentUser.name,
          }),
        });

        await db.insert(notificationsTable).values(notification);

        logger.info({
          transferRequestUUID: requestUUID,
          fromUserId: transferRequest.fromUserId,
          toUserId: currentUser.id,
        }, "Vehicle transfer rejected");
      }

      return c.json({
        message: `Transfer request ${action}ed successfully`,
        transferRequest: updatedRequest,
      });
    },
  )

  // Cancel a sent transfer request
  .patch(
    "/:requestUUID/cancel",
    describeRoute({
      tags: ["Ownership Transfers"],
      description: "Cancel a sent transfer request",
      summary: "Cancel transfer request",
      responses: {
        200: {
          description: "Transfer request cancelled",
          content: {
            "application/json": {
              schema: resolver(zTransferRequestCancelResponseSchema),
            },
          },
        },
        400: badRequestResponseObject,
        401: unauthorizedResponseObject,
        404: notFoundResponseObject,
      },
    }),
    async (c) => {
      const currentUser = c.get("user");
      const logger = c.get("logger");

      if (!currentUser) {
        logger.warn("Unauthorized transfer cancellation attempt");
        return c.json({ error: "Unauthorized" }, 401);
      }

      const requestUUID = c.req.param("requestUUID");

      // Get the transfer request
      const transferRequest = await db
        .select()
        .from(transferRequestsTable)
        .where(
          and(
            eq(transferRequestsTable.uuid, requestUUID),
            eq(transferRequestsTable.fromUserId, currentUser.id),
          ),
        )
        .then(res => res[0]);

      if (!transferRequest) {
        return c.json({ error: "Transfer request not found or you don't have permission to cancel it" }, 404);
      }

      if (transferRequest.status !== "pending") {
        return c.json({ error: "Only pending transfer requests can be cancelled" }, 400);
      }

      // Cancel the request
      const updatedRequest = await db
        .update(transferRequestsTable)
        .set({ status: "cancelled", respondedAt: new Date() })
        .where(eq(transferRequestsTable.uuid, requestUUID))
        .returning()
        .then(res => res[0]);

      // Notify recipient if they exist
      if (transferRequest.toUserId) {
        const notification = insertNotificationSchema.parse({
          userId: transferRequest.toUserId,
          type: "transfer_cancelled",
          title: "Vehicle Transfer Cancelled",
          message: `${currentUser.name} has cancelled their vehicle transfer request`,
          data: JSON.stringify({
            transferRequestUUID: requestUUID,
            vehicleUUID: transferRequest.vehicleUUID,
            cancelledByName: currentUser.name,
          }),
        });

        await db.insert(notificationsTable).values(notification);
      }

      logger.info({
        transferRequestUUID: requestUUID,
        fromUserId: currentUser.id,
      }, "Transfer request cancelled");

      return c.json({
        message: "Transfer request cancelled successfully",
        transferRequest: updatedRequest,
      });
    },
  )

  // Get transfer history for a specific vehicle
  .get(
    "/vehicle/:vehicleUUID/history",
    describeRoute({
      tags: ["Ownership Transfers"],
      description: "Get complete transfer history for a specific vehicle",
      summary: "Get vehicle transfer history",
      responses: {
        200: {
          description: "Vehicle transfer history retrieved",
          content: {
            "application/json": {
              schema: resolver(zVehicleTransferHistoryResponseSchema),
            },
          },
        },
        401: unauthorizedResponseObject,
        404: notFoundResponseObject,
      },
    }),
    async (c) => {
      const currentUser = c.get("user");
      const logger = c.get("logger");

      if (!currentUser) {
        logger.warn("Unauthorized vehicle transfer history access");
        return c.json({ error: "Unauthorized" }, 401);
      }

      const vehicleUUID = c.req.param("vehicleUUID");

      // Verify user has access to this vehicle (either current owner or was involved in a transfer)
      const vehicle = await db
        .select()
        .from(vehiclesTable)
        .where(
          and(
            eq(vehiclesTable.uuid, vehicleUUID),
            isNull(vehiclesTable.deletedAt),
          ),
        )
        .then(res => res[0]);

      if (!vehicle) {
        return c.json({ error: "Vehicle not found" }, 404);
      }

      // Check if user has access to this vehicle's history
      const hasAccess = vehicle.ownerId === currentUser.id
        || await db
          .select()
          .from(ownershipTransfersTable)
          .where(
            and(
              eq(ownershipTransfersTable.vehicleUUID, vehicleUUID),
              or(
                eq(ownershipTransfersTable.fromUserId, currentUser.id),
                eq(ownershipTransfersTable.toUserId, currentUser.id),
              ),
            ),
          )
          .then(res => res.length > 0);

      if (!hasAccess) {
        return c.json({ error: "You don't have access to this vehicle's transfer history" }, 403);
      }

      // Get completed transfers with user information
      const transferHistory = await db
        .select({
          uuid: ownershipTransfersTable.uuid,
          vehicleUUID: ownershipTransfersTable.vehicleUUID,
          fromUserId: ownershipTransfersTable.fromUserId,
          toUserId: ownershipTransfersTable.toUserId,
          transferredAt: ownershipTransfersTable.transferredAt,
          fromUserName: user.name,
          fromUserEmail: user.email,
        })
        .from(ownershipTransfersTable)
        .leftJoin(user, eq(ownershipTransfersTable.fromUserId, user.id))
        .where(eq(ownershipTransfersTable.vehicleUUID, vehicleUUID))
        .orderBy(ownershipTransfersTable.transferredAt);

      // Get recipient user information for each transfer
      const enrichedHistory = await Promise.all(
        transferHistory.map(async (transfer) => {
          const toUser = await db
            .select({ name: user.name, email: user.email })
            .from(user)
            .where(eq(user.id, transfer.toUserId))
            .then(res => res[0]);

          return {
            ...transfer,
            toUserName: toUser?.name || "Unknown User",
            toUserEmail: toUser?.email || "Unknown Email",
          };
        }),
      );

      // Get pending transfer requests for this vehicle
      const pendingRequests = await db
        .select()
        .from(transferRequestsTable)
        .where(
          and(
            eq(transferRequestsTable.vehicleUUID, vehicleUUID),
            eq(transferRequestsTable.status, "pending"),
            gt(transferRequestsTable.expiresAt, new Date()),
          ),
        )
        .orderBy(transferRequestsTable.requestedAt);

      logger.debug({
        userId: currentUser.id,
        vehicleUUID,
        transferCount: enrichedHistory.length,
        pendingCount: pendingRequests.length,
      }, "Vehicle transfer history retrieved");

      return c.json({
        vehicle: {
          uuid: vehicle.uuid,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          vin: vehicle.vin,
        },
        transferHistory: enrichedHistory,
        pendingRequests,
      });
    },
  );
