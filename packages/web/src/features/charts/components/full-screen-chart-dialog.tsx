import type { FullScreenChartDialogProps } from "@/features/charts/types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChartRenderer } from "@/features/charts/components/charts/chart-renderer";

export function FullScreenChartDialog({
  isOpen,
  onClose,
  sensor,
  chartData,
  chartType,
  categoryColor,
}: FullScreenChartDialogProps) {
  if (!sensor)
    return null;

  const sensorUnit = sensor.unit || "";
  const isComparisonMode = sensor.isMultiSeries;

  // Empty handler for chart clicks (copy functionality removed)
  const handleClick = () => {};

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] w-[90vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {sensor.name}
            {!isComparisonMode && sensor.lastValue !== null && (
              <span className="text-base font-normal text-muted-foreground">
                Latest:
                {" "}
                {sensor.lastValue}
                {" "}
                {sensorUnit}
              </span>
            )}
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            {sensor.category}
            {" "}
            - PID:
            {" "}
            {sensor.pid}
          </div>
        </DialogHeader>

        <ChartRenderer
          sensor={sensor}
          chartData={chartData}
          chartType={chartType}
          categoryColor={categoryColor}
          onClick={handleClick}
          className="aspect-auto h-[70vh] w-full"
        />
      </DialogContent>
    </Dialog>
  );
}
