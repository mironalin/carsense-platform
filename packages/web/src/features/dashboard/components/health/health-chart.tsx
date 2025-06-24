import { Activity } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import type { HealthTrend } from "../../types";

type HealthChartProps = {
  healthTrends: HealthTrend[];
};

const chartConfig = {
  healthScore: {
    label: "Health Score",
    color: "hsl(var(--primary))",
  },
};

export function HealthChart({ healthTrends }: HealthChartProps) {
  // Prepare chart data
  const chartData = healthTrends.map(trend => ({
    date: trend.date,
    healthScore: trend.healthScore,
    displayDate: new Date(trend.date).toLocaleDateString([], {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">30-Day Health Trend</h4>
        <span className="text-xs text-muted-foreground">
          {healthTrends.length}
          {" "}
          data points
        </span>
      </div>
      <div className="h-[240px]">
        {chartData.length > 0
          ? (
              <ChartContainer config={chartConfig} className="h-full w-full">
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                    top: 12,
                    bottom: 12,
                  }}
                >
                  <defs>
                    <linearGradient id="fillHealthScore" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="displayDate"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    width={35}
                    tick={{ fontSize: 11 }}
                    domain={[0, 100]}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={(
                      <ChartTooltipContent
                        labelFormatter={(value) => {
                          const dataPoint = chartData.find(d => d.displayDate === value);
                          if (dataPoint) {
                            return new Date(dataPoint.date).toLocaleDateString([], {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            });
                          }
                          return value;
                        }}
                        formatter={value => [`${value}%`, "Health Score"]}
                        indicator="dot"
                      />
                    )}
                  />
                  <Area
                    dataKey="healthScore"
                    type="monotone"
                    fill="url(#fillHealthScore)"
                    fillOpacity={0.4}
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            )
          : (
              <div className="flex items-center justify-center h-full text-muted-foreground border rounded-lg bg-muted/20">
                <div className="text-center">
                  <Activity className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p className="font-medium text-sm">No Health Data</p>
                  <p className="text-xs">Health trends will appear here over time</p>
                </div>
              </div>
            )}
      </div>
    </div>
  );
}
