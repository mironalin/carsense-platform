import { motion } from "framer-motion";
import { Activity } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { HealthTrend } from "../../types";

import { itemVariants } from "../../utils/animation-variants";
import { calculateTrend, getCurrentScore, getTotalKilometers } from "../../utils/health-utils";
import { HealthChart } from "../health/health-chart";
import { HealthScoreDisplay } from "../health/health-score-display";

type HealthTrendsSectionProps = {
  healthTrends: HealthTrend[];
};

export function HealthTrendsSection({ healthTrends }: HealthTrendsSectionProps) {
  const currentScore = getCurrentScore(healthTrends);
  const totalKilometers = getTotalKilometers(healthTrends);
  const trend = calculateTrend(healthTrends);

  return (
    <motion.div variants={itemVariants} className="w-full">
      <Card className="h-full">
        <CardHeader>
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-primary" />
              Vehicle Health
            </CardTitle>
            <CardDescription className="text-sm">
              Overall health score and trends over time
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <HealthScoreDisplay
            currentScore={currentScore}
            totalKilometers={totalKilometers}
            trend={trend}
          />
          <HealthChart healthTrends={healthTrends} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
