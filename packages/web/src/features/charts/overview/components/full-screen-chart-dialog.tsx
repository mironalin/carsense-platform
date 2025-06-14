import { Copy } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { ChartType, Sensor } from "../types";

import { ChartRenderer } from "./charts/chart-renderer";

type FullScreenChartDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  sensor: Sensor | null;
  chartData: any[];
  chartType: ChartType;
  categoryColor: string;
};

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

  // Handle click on chart data point
  const handleClick = (data: any) => {
    if (!data || !data.activePayload || data.activePayload.length === 0)
      return;

    const point = data.activePayload[0].payload;
    const value = point.value;
    const timestamp = new Date(point.timestamp).toLocaleString();

    // Copy to clipboard with sensor name included
    navigator.clipboard.writeText(`${sensor.name}: ${value} ${sensorUnit} at ${timestamp}`).then(() => {
      toast.success("Value copied to clipboard", {
        description: `${sensor.name}: ${value} ${sensorUnit} at ${timestamp}`,
        duration: 2000,
      });
    }).catch((err) => {
      console.error("Could not copy value: ", err);
      toast.error("Failed to copy to clipboard");
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] w-[90vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {sensor.name}
            {sensor.lastValue !== null && (
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
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <Copy className="h-3.5 w-3.5" />
            <span>Click on any data point to copy its value</span>
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
