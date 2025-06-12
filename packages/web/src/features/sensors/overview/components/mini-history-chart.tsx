import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import type { MiniHistoryChartProps } from "../types";

export function MiniHistoryChart({ readings, unit }: MiniHistoryChartProps) {
  if (!readings || readings.length < 2) {
    return null;
  }

  // Sort readings by timestamp (newest first)
  const sortedReadings = [...readings]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10) // Use latest 10 readings
    .reverse(); // Reverse for chart display (oldest first)

  const values = sortedReadings.map(r => r.value);
  const max = Math.max(...values.filter(v => v !== null) as number[]);
  const min = Math.min(...values.filter(v => v !== null) as number[]);
  const range = max - min || 1;

  // Normalize values to percentage height in the chart
  const normalizedValues = values.map((v) => {
    if (v === null)
      return 5; // Min height for null values
    return Math.max(5, Math.min(95, ((v - min) / range) * 90 + 5));
  });

  return (
    <div className="h-12 flex items-end gap-px">
      {normalizedValues.map((height, i) => (
        <TooltipProvider key={i}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="w-2 bg-primary rounded-sm opacity-80 hover:opacity-100 cursor-help transition-all"
                style={{ height: `${height}%` }}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {values[i] !== null ? values[i] : "N/A"}
                {values[i] !== null ? ` ${unit}` : ""}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(sortedReadings[i].timestamp).toLocaleString()}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
