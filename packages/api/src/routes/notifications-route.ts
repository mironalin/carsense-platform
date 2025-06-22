import { and, desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver, validator as zValidator } from "hono-openapi/zod";

import type { AppBindings } from "../lib/types";

import { db } from "../db";
import { notificationsTable } from "../db/schema/notifications";
import { getSessionAndUser } from "../middleware/get-session-and-user";
import {
  notFoundResponseObject,
  unauthorizedResponseObject,
} from "../zod/z-api-responses";
import {
  zMarkNotificationsReadResponseSchema,
  zMarkNotificationsReadSchema,
  zNotificationDeleteResponseSchema,
  zNotificationsListResponseSchema,
  zUnreadCountResponseSchema,
} from "../zod/z-notifications";

export const notificationsRoute = new Hono<AppBindings>()
  .use(getSessionAndUser)

  // Get all notifications for the user
  .get(
    "/",
    describeRoute({
      tags: ["Notifications"],
      description: "Get all notifications for the authenticated user",
      summary: "Get user notifications",
      responses: {
        200: {
          description: "Notifications retrieved",
          content: {
            "application/json": {
              schema: resolver(zNotificationsListResponseSchema),
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
        logger.warn("Unauthorized notifications access");
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Get all notifications for the user
      const notifications = await db
        .select()
        .from(notificationsTable)
        .where(eq(notificationsTable.userId, currentUser.id))
        .orderBy(desc(notificationsTable.createdAt));

      const unreadCount = notifications.filter(n => n.isRead === "false").length;

      logger.debug({
        userId: currentUser.id,
        count: notifications.length,
        unreadCount,
      }, "Notifications retrieved");

      return c.json({
        notifications,
        unreadCount,
      });
    },
  )

  // Mark notifications as read
  .patch(
    "/mark-read",
    describeRoute({
      tags: ["Notifications"],
      description: "Mark specific notifications or all notifications as read",
      summary: "Mark notifications as read",
      responses: {
        200: {
          description: "Notifications marked as read",
          content: {
            "application/json": {
              schema: resolver(zMarkNotificationsReadResponseSchema),
            },
          },
        },
        401: unauthorizedResponseObject,
      },
    }),
    zValidator("json", zMarkNotificationsReadSchema),
    async (c) => {
      const currentUser = c.get("user");
      const logger = c.get("logger");

      if (!currentUser) {
        logger.warn("Unauthorized notifications mark read attempt");
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { notificationUUIDs, markAllAsRead } = c.req.valid("json");

      let updatedNotifications: any[] = [];

      if (markAllAsRead) {
        // Mark all user's notifications as read
        updatedNotifications = await db
          .update(notificationsTable)
          .set({ isRead: "true" })
          .where(
            and(
              eq(notificationsTable.userId, currentUser.id),
              eq(notificationsTable.isRead, "false"),
            ),
          )
          .returning();
      }
      else if (notificationUUIDs && notificationUUIDs.length > 0) {
        // Better approach for specific UUIDs - update one by one
        updatedNotifications = [];
        for (const uuid of notificationUUIDs) {
          const updated = await db
            .update(notificationsTable)
            .set({ isRead: "true" })
            .where(
              and(
                eq(notificationsTable.uuid, uuid),
                eq(notificationsTable.userId, currentUser.id),
              ),
            )
            .returning();
          updatedNotifications.push(...updated);
        }
      }

      logger.debug({
        userId: currentUser.id,
        updatedCount: updatedNotifications?.length || 0,
        markAllAsRead: !!markAllAsRead,
      }, "Notifications marked as read");

      return c.json({
        message: `${updatedNotifications?.length || 0} notification(s) marked as read`,
        updatedCount: updatedNotifications?.length || 0,
      });
    },
  )

  // Delete a notification
  .delete(
    "/:notificationUUID",
    describeRoute({
      tags: ["Notifications"],
      description: "Delete a specific notification",
      summary: "Delete notification",
      responses: {
        200: {
          description: "Notification deleted",
          content: {
            "application/json": {
              schema: resolver(zNotificationDeleteResponseSchema),
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
        logger.warn("Unauthorized notification deletion attempt");
        return c.json({ error: "Unauthorized" }, 401);
      }

      const notificationUUID = c.req.param("notificationUUID");

      // Verify the notification belongs to the user and delete it
      const deletedNotification = await db
        .delete(notificationsTable)
        .where(
          and(
            eq(notificationsTable.uuid, notificationUUID),
            eq(notificationsTable.userId, currentUser.id),
          ),
        )
        .returning();

      if (deletedNotification.length === 0) {
        return c.json({ error: "Notification not found" }, 404);
      }

      logger.debug({
        userId: currentUser.id,
        notificationUUID,
      }, "Notification deleted");

      return c.json({
        message: "Notification deleted successfully",
      });
    },
  )

  // Get unread count only
  .get(
    "/unread-count",
    describeRoute({
      tags: ["Notifications"],
      description: "Get count of unread notifications",
      summary: "Get unread notifications count",
      responses: {
        200: {
          description: "Unread count retrieved",
          content: {
            "application/json": {
              schema: resolver(zUnreadCountResponseSchema),
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
        logger.warn("Unauthorized unread count access");
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Get count of unread notifications
      const unreadNotifications = await db
        .select()
        .from(notificationsTable)
        .where(
          and(
            eq(notificationsTable.userId, currentUser.id),
            eq(notificationsTable.isRead, "false"),
          ),
        );

      const unreadCount = unreadNotifications.length;

      return c.json({
        unreadCount,
      });
    },
  );
