import { motion } from "framer-motion";
import { CalendarIcon, DollarSignIcon, TrendingUpIcon, WrenchIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { MaintenanceSummary as MaintenanceSummaryType } from "../../types";

import { itemVariants } from "../../utils/animation-variants";
import {
  formatCost,
  formatServiceDate,
  getServiceTypeLabel,
} from "../../utils/maintenance-utils";

type MaintenanceSummaryProps = {
  summary: MaintenanceSummaryType;
};

export function MaintenanceSummary({ summary }: MaintenanceSummaryProps) {
  const summaryCards = [
    {
      title: "Total Services",
      value: summary.totalEntries.toString(),
      icon: WrenchIcon,
      description: `${summary.totalEntries} maintenance ${summary.totalEntries === 1 ? "entry" : "entries"} recorded`,
    },
    {
      title: "Total Cost",
      value: formatCost(summary.totalCost),
      icon: DollarSignIcon,
      description: "Total amount spent on maintenance",
    },
    {
      title: "Most Common Service",
      value: summary.mostCommonService
        ? getServiceTypeLabel(summary.mostCommonService.type)
        : "N/A",
      icon: TrendingUpIcon,
      description: summary.mostCommonService
        ? `${summary.mostCommonService.count} ${summary.mostCommonService.count === 1 ? "time" : "times"}`
        : "No services recorded",
    },
    {
      title: "Last Service",
      value: summary.lastService
        ? formatServiceDate(summary.lastService.serviceDate)
        : "N/A",
      icon: CalendarIcon,
      description: summary.lastService
        ? (summary.lastService.serviceTypes.length === 1
            ? getServiceTypeLabel(summary.lastService.serviceTypes[0])
            : `${summary.lastService.serviceTypes.length} services`)
        : "No recent services",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryCards.map((card, index) => (
        <motion.div
          key={card.title}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1 }}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col justify-between flex-1">
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {card.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
