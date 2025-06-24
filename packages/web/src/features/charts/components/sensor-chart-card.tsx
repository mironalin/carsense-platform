import { motion } from "framer-motion";
import { Expand, Star } from "lucide-react";

import type { ChartType, SensorChartCardProps } from "@/features/charts/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartRenderer } from "@/features/charts/components/charts/chart-renderer";

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

// Create motion component for Card
const MotionCard = motion.create(Card);

export function SensorChartCard({
  sensor,
  chartData,
  categoryColor,
  chartType,
  index,
  isFavorite = false,
  isVisible = true,
  onFavoriteToggle,
  onFullScreen,
  onChartClick,
  isComparisonMode = false,
  availableChartTypes = ["line", "area", "bar"],
  onChartTypeChange,
}: SensorChartCardProps) {
  // Border style based on category
  const borderStyle = {
    borderLeftColor: categoryColor,
  };

  // Default empty click handler
  const handleChartClick = onChartClick || (() => {});

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
      {/* Favorite button - only show in overview mode */}
      {!isComparisonMode && onFavoriteToggle && (
        <Button
          variant="ghost"
          size="sm"
          className={`absolute right-2 top-2 h-8 w-8 p-0 z-10 ${isFavorite ? "text-yellow-500" : ""}`}
          onClick={onFavoriteToggle}
        >
          <Star className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
          <span className="sr-only">{isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
        </Button>
      )}

      {/* Full-screen button */}
      {onFullScreen && (
        <Button
          variant="ghost"
          size="sm"
          className={`absolute ${!isComparisonMode ? "right-11" : "right-2"} top-2 h-8 w-8 p-0 z-10`}
          onClick={onFullScreen}
        >
          <Expand className="h-5 w-5" />
          <span className="sr-only">View full-screen</span>
        </Button>
      )}

      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {sensor.name}
          {!isComparisonMode && sensor.lastValue !== null && (
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
        {isComparisonMode && onChartTypeChange
          ? (
              <Tabs
                defaultValue={chartType}
                className="w-full"
                onValueChange={value => onChartTypeChange(value as ChartType)}
              >
                <TabsList className="mb-2 h-8 w-fit">
                  {availableChartTypes.includes("line") && (
                    <TabsTrigger value="line" className="h-7 text-xs">Line</TabsTrigger>
                  )}
                  {availableChartTypes.includes("area") && (
                    <TabsTrigger value="area" className="h-7 text-xs">Area</TabsTrigger>
                  )}
                  {availableChartTypes.includes("bar") && (
                    <TabsTrigger value="bar" className="h-7 text-xs">Bar</TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="line" className="mt-0">
                  {isVisible
                    ? (
                        <ChartRenderer
                          sensor={sensor}
                          chartData={chartData}
                          chartType="line"
                          categoryColor={categoryColor}
                          onClick={handleChartClick}
                        />
                      )
                    : (
                        <div className="flex h-[250px] w-full items-center justify-center">
                          <div className="text-sm text-muted-foreground">Loading chart...</div>
                        </div>
                      )}
                </TabsContent>

                <TabsContent value="area" className="mt-0">
                  {isVisible
                    ? (
                        <ChartRenderer
                          sensor={sensor}
                          chartData={chartData}
                          chartType="area"
                          categoryColor={categoryColor}
                          onClick={handleChartClick}
                        />
                      )
                    : (
                        <div className="flex h-[250px] w-full items-center justify-center">
                          <div className="text-sm text-muted-foreground">Loading chart...</div>
                        </div>
                      )}
                </TabsContent>

                <TabsContent value="bar" className="mt-0">
                  {isVisible
                    ? (
                        <ChartRenderer
                          sensor={sensor}
                          chartData={chartData}
                          chartType="bar"
                          categoryColor={categoryColor}
                          onClick={handleChartClick}
                        />
                      )
                    : (
                        <div className="flex h-[250px] w-full items-center justify-center">
                          <div className="text-sm text-muted-foreground">Loading chart...</div>
                        </div>
                      )}
                </TabsContent>
              </Tabs>
            )
          : (
              isVisible
                ? (
                    <ChartRenderer
                      sensor={sensor}
                      chartData={chartData}
                      chartType={chartType}
                      categoryColor={categoryColor}
                      onClick={handleChartClick}
                    />
                  )
                : (
                    <div className="flex h-[250px] w-full items-center justify-center">
                      <div className="text-sm text-muted-foreground">Loading chart...</div>
                    </div>
                  )
            )}
      </CardContent>
    </MotionCard>
  );
}
