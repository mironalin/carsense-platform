import { Activity, TrendingDown, TrendingUp } from "lucide-react";

export function getTrendIcon(trend: "up" | "down" | "stable") {
  if (trend === "up") {
    return <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />;
  }
  if (trend === "down") {
    return <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />;
  }
  return <Activity className="h-4 w-4 text-muted-foreground" />;
}
