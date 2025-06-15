import type { ChartRendererProps } from "@/features/charts/types";

import { AreaChartComponent } from "./area-chart-component";
import { BarChartComponent } from "./bar-chart-component";
import { LineChartComponent } from "./line-chart-component";

export function ChartRenderer({
  sensor,
  chartData,
  chartType,
  categoryColor,
  onClick = () => {},
  className,
}: ChartRendererProps) {
  switch (chartType) {
    case "area":
      return (
        <AreaChartComponent
          sensor={sensor}
          chartData={chartData}
          categoryColor={categoryColor}
          onClick={onClick}
          className={className}
        />
      );
    case "line":
      return (
        <LineChartComponent
          sensor={sensor}
          chartData={chartData}
          categoryColor={categoryColor}
          onClick={onClick}
          className={className}
        />
      );
    case "bar":
      return (
        <BarChartComponent
          sensor={sensor}
          chartData={chartData}
          categoryColor={categoryColor}
          onClick={onClick}
          className={className}
        />
      );
    default:
      return (
        <AreaChartComponent
          sensor={sensor}
          chartData={chartData}
          categoryColor={categoryColor}
          onClick={onClick}
          className={className}
        />
      );
  }
}
