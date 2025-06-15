import { AreaChart, BarChart3, LineChart } from "lucide-react";

import type { ChartType, ChartTypeSelectorProps } from "@/features/charts/types";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function ChartTypeSelector({ chartType, onChartTypeChange }: ChartTypeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <ToggleGroup
        type="single"
        value={chartType}
        onValueChange={value => value && onChartTypeChange(value as ChartType)}
        className="border rounded-md"
      >
        <ToggleGroupItem value="area" aria-label="Area Chart" className="h-8 w-8 p-0">
          <AreaChart className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="line" aria-label="Line Chart" className="h-8 w-8 p-0">
          <LineChart className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="bar" aria-label="Bar Chart" className="h-8 w-8 p-0">
          <BarChart3 className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
