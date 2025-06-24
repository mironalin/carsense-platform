import { AlertTriangle, Bell, Calendar, Stethoscope, Wrench } from "lucide-react";

import type { RecentActivity } from "../types";

export function getActivityIcon(activityType: RecentActivity["type"]) {
  switch (activityType) {
    case "diagnostic":
      return <Stethoscope className="h-4 w-4" />;
    case "maintenance":
      return <Wrench className="h-4 w-4" />;
    case "dtc":
      return <AlertTriangle className="h-4 w-4" />;
    case "notification":
      return <Bell className="h-4 w-4" />;
    default:
      return <Calendar className="h-4 w-4" />;
  }
}

export function getActivityIconColor(activityType: RecentActivity["type"]) {
  switch (activityType) {
    case "diagnostic":
      return "text-primary";
    case "maintenance":
      return "text-violet-600 dark:text-violet-400";
    case "dtc":
      return "text-destructive";
    case "notification":
      return "text-orange-600 dark:text-orange-400";
    default:
      return "text-muted-foreground";
  }
}

export function formatActivityDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  else if (diffInHours < 168) { // 7 days
    return date.toLocaleDateString([], { weekday: "short", hour: "2-digit", minute: "2-digit" });
  }
  else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
}
