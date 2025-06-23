import { motion } from "framer-motion";
import { Bell } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fadeAnimation } from "@/features/notifications/utils/animation-variants";

type NotificationsHeaderProps = {
  unreadCount: number;
  onMarkAllAsRead: () => void;
  isMarkingAsRead?: boolean;
};

export function NotificationsHeader({
  unreadCount,
  onMarkAllAsRead,
  isMarkingAsRead = false,
}: NotificationsHeaderProps) {
  return (
    <motion.div variants={fadeAnimation}>
      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <div className="flex items-center justify-center gap-2">
            <Bell className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          </div>
          <p className="text-base lg:text-xl text-muted-foreground mt-1">
            Stay updated on vehicle transfers and system updates
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <>
              <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
                {unreadCount}
                {" "}
                unread
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={onMarkAllAsRead}
                disabled={isMarkingAsRead}
              >
                Mark All as Read
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
