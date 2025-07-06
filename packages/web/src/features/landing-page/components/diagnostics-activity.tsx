import DottedMap from "dotted-map";
import { Activity, Map as MapIcon, MessageCircle, User } from "lucide-react";
import { Area, AreaChart, CartesianGrid } from "recharts";

import type { ChartConfig } from "@/components/ui/chart";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function DiagnosticActivity() {
  return (
    <section className="px-4 py-16 md:py-32">
      <div className="mx-auto grid max-w-5xl border md:grid-cols-2">
        <div>
          <div className="p-6 sm:p-12">
            <span className="text-muted-foreground flex items-center gap-2">
              <MapIcon className="size-4" />
              Vehicle location tracking
            </span>

            <p className="mt-8 text-2xl font-semibold">Track diagnostic sessions and vehicle locations in real-time.</p>
          </div>

          <div
            aria-hidden
            className="relative"
          >
            <div className="absolute inset-0 z-10 m-auto size-fit">
              <div className="rounded-(--radius) bg-background z-1 dark:bg-muted relative flex size-fit w-fit items-center gap-2 border px-3 py-1 text-xs font-medium shadow-md shadow-zinc-950/5">
                <span className="text-lg">🚗</span>
                {" "}
                Last diagnostic scan from Bucharest, Romania 🇷🇴
              </div>
              <div className="rounded-(--radius) bg-background absolute inset-2 -bottom-2 mx-auto border px-3 py-4 text-xs font-medium shadow-md shadow-zinc-950/5 dark:bg-zinc-900"></div>
            </div>

            <div className="relative overflow-hidden">
              <div className="bg-radial z-1 to-background absolute inset-0 from-transparent to-75%"></div>
              <Map />
            </div>
          </div>
        </div>
        <div className="overflow-hidden border-t bg-zinc-50 p-6 sm:p-12 md:border-0 md:border-l dark:bg-transparent">
          <div className="relative z-10">
            <span className="text-muted-foreground flex items-center gap-2">
              <MessageCircle className="size-4" />
              AI-powered diagnostic support
            </span>

            <p className="my-8 text-2xl font-semibold">Get instant help from our AI chatbot and automotive experts.</p>
          </div>
          <div
            aria-hidden
            className="flex flex-col gap-8"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-5 rounded-full border items-center justify-center">
                  <User className="h-3 w-3" />
                </span>
                <span className="text-muted-foreground text-xs">Today 2:45 PM</span>
              </div>
              <div className="rounded-(--radius) bg-background mt-1.5 w-3/5 border p-3 text-xs">My car is showing error code P0420. What does this mean?</div>
            </div>

            <div>
              <div className="rounded-(--radius) mb-1 ml-auto w-3/5 bg-blue-600 p-3 text-xs text-white">P0420 indicates a catalytic converter efficiency issue. Our AI analyzed your sensor data and suggests checking oxygen sensors first. Would you like me to guide you through the diagnostic steps?</div>
              <span className="text-muted-foreground block text-right text-xs">CarSense AI • Now</span>
            </div>
          </div>
        </div>
        <div className="col-span-full border-y p-12">
          <p className="text-center text-4xl font-semibold lg:text-7xl">99.99% Uptime</p>
          <p className="text-center text-sm text-muted-foreground mt-4">Powered by Cloudflare's global network</p>
        </div>
        <div className="relative col-span-full">
          <div className="absolute z-10 max-w-lg px-6 pr-12 pt-6 md:px-12 md:pt-12">
            <span className="text-muted-foreground flex items-center gap-2">
              <Activity className="size-4" />
              Diagnostic activity
            </span>

            <p className="my-8 text-2xl font-semibold">
              Monitor all vehicle diagnostic sessions in real-time.
              {" "}
              <span className="text-muted-foreground">Track error codes, sensor readings, and maintenance alerts.</span>
            </p>
          </div>
          <DiagnosticChart />
        </div>
      </div>
    </section>
  );
}

const map = new DottedMap({ height: 55, grid: "diagonal" });

const points = map.getPoints();

const svgOptions = {
  backgroundColor: "var(--color-background)",
  color: "currentColor",
  radius: 0.15,
};

function Map() {
  const viewBox = `0 0 120 60`;
  return (
    <svg
      viewBox={viewBox}
      style={{ background: svgOptions.backgroundColor }}
    >
      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={svgOptions.radius}
          fill={svgOptions.color}
        />
      ))}
    </svg>
  );
}

const chartConfig = {
  errorCodes: {
    label: "Error Codes",
    color: "#ef4444",
  },
  sensorReadings: {
    label: "Sensor Readings",
    color: "#3b82f6",
  },
} satisfies ChartConfig;

const chartData = [
  { month: "May", errorCodes: 12, sensorReadings: 200 },
  { month: "June", errorCodes: 15, sensorReadings: 234 },
  { month: "July", errorCodes: 19, sensorReadings: 290 },
  { month: "August", errorCodes: 23, sensorReadings: 380 },
  { month: "September", errorCodes: 26, sensorReadings: 592 },
  { month: "October", errorCodes: 29, sensorReadings: 663 },
];

function DiagnosticChart() {
  return (
    <ChartContainer
      className="h-120 aspect-auto md:h-96"
      config={chartConfig}
    >
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 0,
          right: 0,
        }}
      >
        <defs>
          <linearGradient
            id="fillErrorCodes"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="var(--color-errorCodes)"
              stopOpacity={0.8}
            />
            <stop
              offset="55%"
              stopColor="var(--color-errorCodes)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient
            id="fillSensorReadings"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="var(--color-sensorReadings)"
              stopOpacity={0.8}
            />
            <stop
              offset="55%"
              stopColor="var(--color-sensorReadings)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <ChartTooltip
          active
          cursor={false}
          content={<ChartTooltipContent className="dark:bg-muted" />}
        />
        <Area
          strokeWidth={2}
          dataKey="sensorReadings"
          type="stepBefore"
          fill="url(#fillSensorReadings)"
          fillOpacity={0.1}
          stroke="var(--color-sensorReadings)"
          stackId="a"
        />
        <Area
          strokeWidth={2}
          dataKey="errorCodes"
          type="stepBefore"
          fill="url(#fillErrorCodes)"
          fillOpacity={0.1}
          stroke="var(--color-errorCodes)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
