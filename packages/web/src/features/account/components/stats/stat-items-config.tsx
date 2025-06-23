import { Calendar, CheckCircle, Shield, User, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { ProfileStats } from "../../types";

export interface StatItemConfig {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
  bgColor: string;
  showVerifiedBadge?: boolean;
  showAdminBadge?: boolean;
}

export function getStatItemsConfig(stats: ProfileStats): StatItemConfig[] {
  return [
    {
      icon: Calendar,
      label: "Member Since",
      value: stats.memberSince,
      color: "text-primary",
      bgColor: "bg-primary/5",
    },
    {
      icon: stats.emailVerified ? CheckCircle : XCircle,
      label: "Email Status",
      value: stats.emailVerified ? "Verified" : "Unverified",
      color: stats.emailVerified ? "text-green-600 dark:text-green-400" : "text-destructive",
      bgColor: stats.emailVerified 
        ? "bg-green-50 dark:bg-green-950/20" 
        : "bg-destructive/5",
      showVerifiedBadge: stats.emailVerified,
    },
    {
      icon: Shield,
      label: "Account Type",
      value: stats.accountType,
      color: "text-chart-2",
      bgColor: "bg-chart-2/5",
      showAdminBadge: stats.accountType === "Administrator",
    },
    {
      icon: User,
      label: "Last Activity",
      value: stats.lastLogin,
      color: "text-chart-3",
      bgColor: "bg-chart-3/5",
    },
  ];
} 