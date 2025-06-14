import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import type { ChartConfig, Sensor } from "../../types";

type LineChartComponentProps = {
  sensor: Sensor;
  chartData: any[];
  categoryColor: string;
  onClick: (data: any) => void;
  className?: string;
};

export function LineChartComponent({
  sensor,
  chartData,
  categoryColor,
  onClick,
  className = "aspect-auto h-[250px] w-full pr-4",
}: LineChartComponentProps) {
  const sensorUnit = sensor.unit || "";

  // Chart config for the container
  const chartConfig = {
    [sensor.pid]: {
      label: sensor.name,
      color: categoryColor,
    },
  } satisfies ChartConfig;

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
          dataKey="timestamp"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          interval="preserveStartEnd"
          tickCount={10}
          tickFormatter={(value) => {
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
              labelFormatter={(value) => {
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
        <Line
          name={sensor.name}
          dataKey="value"
          type="monotone"
          stroke={categoryColor}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6, fill: categoryColor }}
        />
      </LineChart>
    </ChartContainer>
  );
}
