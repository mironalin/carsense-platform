import type { ChartControlsProps } from "@/features/charts/types";

import { ChartTypeSelector } from "./chart-type-selector";
import { ColorThemeSelector } from "./color-theme-selector";

export function ChartControls({
  chartType,
  onChartTypeChange,
  colorTheme,
  onColorThemeChange,
}: ChartControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ChartTypeSelector chartType={chartType} onChartTypeChange={onChartTypeChange} />
      <ColorThemeSelector colorTheme={colorTheme} onColorThemeChange={onColorThemeChange} />
    </div>
  );
}
