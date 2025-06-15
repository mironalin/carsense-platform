import type { ChartType, Sensor } from "@/features/charts/types";

import { SensorChartCard } from "@/features/charts/components/sensor-chart-card";

type ComparisonChartCardProps = {
  sensor: Sensor & {
    isMultiSeries: boolean;
    seriesConfig: Record<string, { label: string; color: string }>;
  };
  chartData: any[];
  chartType: ChartType;
  categoryColor: string;
  index: number;
  onFullScreen: () => void;
};

export function ComparisonChartCard({
  sensor,
  chartData,
  chartType,
  categoryColor,
  index,
  onFullScreen,
}: ComparisonChartCardProps) {
  // This component wraps SensorChartCard to provide a consistent interface for comparison charts
  return (
    <SensorChartCard
      sensor={sensor}
      chartData={chartData}
      chartType={chartType}
      categoryColor={categoryColor}
      index={index}
      isComparisonMode={true}
      isVisible={true}
      onFullScreen={onFullScreen}
    />
  );
}
