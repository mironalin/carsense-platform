import { motion } from "framer-motion";
import { Expand, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { ChartType, Sensor } from "../types";

import { ChartRenderer } from "./charts/chart-renderer";

// Motion variants for chart animations
const chartVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Convert Card to motion.div with Card styling
const MotionCard = motion(Card);

type SensorChartCardProps = {
  sensor: Sensor;
  chartData: any[];
  categoryColor: string;
  chartType: ChartType;
  index: number;
  isFavorite: boolean;
  isVisible: boolean;
  onFavoriteToggle: () => void;
  onFullScreen: () => void;
  onChartClick: (data: any) => void;
};

export function SensorChartCard({
  sensor,
  chartData,
  categoryColor,
  chartType,
  index,
  isFavorite,
  isVisible,
  onFavoriteToggle,
  onFullScreen,
  onChartClick,
}: SensorChartCardProps) {
  // Border style based on category
  const borderStyle = {
    borderLeftColor: categoryColor,
  };

  return (
    <MotionCard
      className="@container/card relative border-l-[3px]"
      style={borderStyle}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1 }}
      variants={chartVariants}
      transition={{ delay: index * 0.05 }} // Stagger the animations
      data-sensor-id={sensor.pid}
    >
      {/* Favorite button */}
      <Button
        variant="ghost"
        size="sm"
        className={`absolute right-2 top-2 h-8 w-8 p-0 z-10 ${isFavorite ? "text-yellow-500" : ""}`}
        onClick={onFavoriteToggle}
      >
        <Star className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
        <span className="sr-only">{isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
      </Button>

      {/* Full-screen button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-11 top-2 h-8 w-8 p-0 z-10"
        onClick={onFullScreen}
      >
        <Expand className="h-5 w-5" />
        <span className="sr-only">View full-screen</span>
      </Button>

      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {sensor.name}
          {sensor.lastValue !== null && (
            <span className="text-base font-normal text-muted-foreground">
              Latest:
              {" "}
              {sensor.lastValue}
              {" "}
              {sensor.unit || ""}
            </span>
          )}
        </CardTitle>
        <CardDescription>
          {sensor.category}
          {" "}
          - PID:
          {" "}
          {sensor.pid}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2">
        {isVisible
          ? (
              <ChartRenderer
                sensor={sensor}
                chartData={chartData}
                chartType={chartType}
                categoryColor={categoryColor}
                onClick={onChartClick}
              />
            )
          : (
              <div className="flex h-[250px] w-full items-center justify-center">
                <div className="text-sm text-muted-foreground">Loading chart...</div>
              </div>
            )}
      </CardContent>
    </MotionCard>
  );
}
