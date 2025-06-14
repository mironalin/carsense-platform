import type { ChartType, Sensor } from "../../types";

import { AreaChartComponent } from "./area-chart-component";
import { BarChartComponent } from "./bar-chart-component";
import { LineChartComponent } from "./line-chart-component";

type ChartRendererProps = {
  sensor: Sensor;
  chartData: any[];
  chartType: ChartType;
  categoryColor: string;
  onClick: (data: any) => void;
  className?: string;
};

export function ChartRenderer({
  sensor,
  chartData,
  chartType,
  categoryColor,
  onClick,
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
