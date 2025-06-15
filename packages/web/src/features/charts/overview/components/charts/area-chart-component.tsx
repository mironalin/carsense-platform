import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import type { ChartConfig, Sensor } from "@/features/charts/types";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type AreaChartComponentProps = {
  sensor: Sensor;
  chartData: any[];
  categoryColor: string;
  onClick: (data: any) => void;
  className?: string;
};

export function AreaChartComponent({
  sensor,
  chartData,
  categoryColor,
  onClick,
  className = "aspect-auto h-[250px] w-full pr-4",
}: AreaChartComponentProps) {
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
      <AreaChart
        accessibilityLayer
        data={chartData}
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        <defs>
          <linearGradient id={`fill-${sensor.pid}`} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={categoryColor}
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor={categoryColor}
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
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
        <Area
          name={sensor.name}
          dataKey="value"
          type="monotone"
          fill={`url(#fill-${sensor.pid})`}
          stroke={categoryColor}
          isAnimationActive={true}
        />
      </AreaChart>
    </ChartContainer>
  );
}
