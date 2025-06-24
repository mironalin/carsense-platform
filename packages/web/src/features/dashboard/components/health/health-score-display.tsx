import { HelpCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

import { formatKilometers, getHealthStatusColor, getHealthStatusDescription, getHealthStatusText } from "../../utils/health-utils";
import { getTrendIcon } from "../../utils/trend-utils";
import { HealthScoreExplanationDialog } from "./health-score-explanation-dialog";

type HealthScoreDisplayProps = {
  currentScore: number;
  totalKilometers: number;
  trend: "up" | "down" | "stable";
};

export function HealthScoreDisplay({ currentScore, totalKilometers, trend }: HealthScoreDisplayProps) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-baseline gap-2 mb-1">
            <span className={`text-4xl font-bold ${getHealthStatusColor(currentScore)}`}>
              {currentScore}
            </span>
            <span className="text-lg text-muted-foreground font-medium">/100</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${getHealthStatusColor(currentScore)}`}>
              {getHealthStatusText(currentScore)}
            </span>
            {getTrendIcon(trend)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {getHealthStatusDescription(currentScore)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">
              {formatKilometers(totalKilometers)}
              {" "}
              km
            </div>
            <div className="text-xs text-muted-foreground">
              Total driven
            </div>
          </div>
          <HealthScoreExplanationDialog>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </HealthScoreExplanationDialog>
        </div>
      </div>
    </div>
  );
}
