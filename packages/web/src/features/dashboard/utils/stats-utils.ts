import type { QuickStats } from "../types";

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function createStatsData(quickStats: QuickStats) {
  const {
    totalDiagnostics,
    totalMaintenance,
    totalNotifications,
    activeDTCs,
    maintenanceCostYTD,
  } = quickStats;

  return [
    {
      title: "Diagnostic Sessions",
      value: totalDiagnostics,
      description: "Total sessions run",
      color: "blue" as const,
      iconType: "stethoscope",
    },
    {
      title: "Active DTCs",
      value: activeDTCs,
      description: "Needs attention",
      color: activeDTCs > 0 ? ("red" as const) : ("green" as const),
      iconType: "alert-circle",
    },
    {
      title: "Maintenance Records",
      value: totalMaintenance,
      description: "Service history",
      color: "purple" as const,
      iconType: "wrench",
    },
    {
      title: "Notifications",
      value: totalNotifications,
      description: "System alerts",
      color: "yellow" as const,
      iconType: "bell",
    },
    {
      title: "Maintenance Cost",
      value: formatCurrency(maintenanceCostYTD),
      description: "This year's spending",
      color: "green" as const,
      iconType: "dollar-sign",
    },
  ];
}
