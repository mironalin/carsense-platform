import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { QuickStats } from "../../types";

import { itemVariants } from "../../utils/animation-variants";
import { getStatsIcon } from "../../utils/stats-icon-utils";
import { createStatsData } from "../../utils/stats-utils";
import { StatCard } from "../stats/stat-card";

type QuickStatsSectionProps = {
  quickStats: QuickStats;
};

export function QuickStatsSection({ quickStats }: QuickStatsSectionProps) {
  const stats = createStatsData(quickStats);

  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Quick Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="h-full">
                <StatCard
                  title={stat.title}
                  value={stat.value}
                  icon={getStatsIcon(stat.iconType)}
                  description={stat.description}
                  color={stat.color}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
