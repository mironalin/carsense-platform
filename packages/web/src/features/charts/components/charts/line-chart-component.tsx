import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import type { ChartConfig, LineChartComponentProps } from "@/features/charts/types";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export function LineChartComponent({
  sensor,
  chartData,
  categoryColor,
  onClick,
  className = "aspect-auto h-[250px] w-full pr-4",
}: LineChartComponentProps) {
  const sensorUnit = sensor.unit || "";

  // Check if this is a multi-series chart
  const isMultiSeries = sensor.isMultiSeries === true;
  const seriesConfig = isMultiSeries && sensor.seriesConfig ? sensor.seriesConfig : null;

  // Chart config for the container
  const chartConfig: ChartConfig = isMultiSeries && seriesConfig
    ? Object.entries(seriesConfig).reduce((acc, [key, value]) => {
        acc[key] = {
          label: value.label,
          color: value.color,
        };
        return acc;
      }, {} as ChartConfig)
    : {
        [sensor.pid]: {
          label: sensor.name,
          color: categoryColor,
        },
      };

  return (
    <ChartContainer config={chartConfig} className={className}>
      <LineChart
        accessibilityLayer
        data={chartData}
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={isMultiSeries ? "index" : "timestamp"}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          interval="preserveStartEnd"
          tickCount={10}
          tickFormatter={(value) => {
            if (isMultiSeries) {
              // For multi-series, show point number (1-indexed for user display)
              // Make sure value is a valid number
              const pointIndex = typeof value === "number" ? value : Number.parseInt(value, 10);
              return Number.isNaN(pointIndex) ? "-" : `#${pointIndex + 1}`;
            }

            // For single series, format timestamp as before
            const date = new Date(value);
            return date.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            });
          }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={value => `${value}${sensorUnit}`}
        />
        <ChartTooltip
          cursor={false}
          content={(
            <ChartTooltipContent
              labelFormatter={(value, payload) => {
                if (isMultiSeries && payload && payload.length > 0) {
                  // Access the pointNumber directly from the payload data
                  const dataPoint = payload[0].payload;
                  if (dataPoint && dataPoint.pointNumber) {
                    return `Point #${dataPoint.pointNumber}`;
                  }

                  // Fallback to the index if pointNumber is not available
                  const pointIndex = typeof value === "number" ? value : Number.parseInt(String(value), 10);
                  if (!Number.isNaN(pointIndex)) {
                    return `Point #${pointIndex + 1}`;
                  }
                  return "Point";
                }

                // For single series, format timestamp as before
                return new Date(value).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                });
              }}
              indicator="dot"
            />
          )}
        />

        {/* Render a single line for standard charts */}
        {!isMultiSeries && (
          <Line
            name={sensor.name}
            dataKey="value"
            type="monotone"
            stroke={categoryColor}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: categoryColor }}
          />
        )}

        {/* Render multiple lines for multi-series charts */}
        {isMultiSeries && seriesConfig && Object.keys(seriesConfig).map(seriesId => (
          <Line
            key={`line-${seriesId}`}
            name={seriesConfig[seriesId].label}
            dataKey={seriesId}
            type="monotone"
            stroke={seriesConfig[seriesId].color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: seriesConfig[seriesId].color }}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}
