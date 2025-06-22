import { z } from "zod";
import "zod-openapi/extend";

import { selectNotificationSchema } from "../db/schema/notifications";

// =============================================================================
// Input Schemas - Used for validating request payloads
// =============================================================================

/**
 * Schema for marking notifications as read
 */
export const zMarkNotificationsReadSchema = z.object({
  notificationUUIDs: z.array(z.string().uuid()).optional(),
  markAllAsRead: z.boolean().optional(),
}).refine(data => data.notificationUUIDs || data.markAllAsRead, {
  message: "Either notificationUUIDs or markAllAsRead must be provided",
});

export type MarkNotificationsReadSchema = z.infer<typeof zMarkNotificationsReadSchema>;

// =============================================================================
// Response Schemas
// =============================================================================

/**
 * Schema for notifications list response
 */
export const zNotificationsListResponseSchema = z.object({
  notifications: z.array(selectNotificationSchema),
  unreadCount: z.number().openapi({ example: 3 }),
});

export type NotificationsListResponse = z.infer<typeof zNotificationsListResponseSchema>;

/**
 * Schema for mark notifications as read response
 */
export const zMarkNotificationsReadResponseSchema = z.object({
  message: z.string().openapi({ example: "3 notification(s) marked as read" }),
  updatedCount: z.number().openapi({ example: 3 }),
});

export type MarkNotificationsReadResponse = z.infer<typeof zMarkNotificationsReadResponseSchema>;

/**
 * Schema for notification deletion response
 */
export const zNotificationDeleteResponseSchema = z.object({
  message: z.string().openapi({ example: "Notification deleted successfully" }),
});

export type NotificationDeleteResponse = z.infer<typeof zNotificationDeleteResponseSchema>;

/**
 * Schema for unread count response
 */
export const zUnreadCountResponseSchema = z.object({
  unreadCount: z.number().openapi({ example: 5 }),
});

export type UnreadCountResponse = z.infer<typeof zUnreadCountResponseSchema>;
