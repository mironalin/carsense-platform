import { motion } from "framer-motion";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import type { PlaybackSensor } from "../types";

import { getCategoryIcon } from "../../utils/sensor-categories";
import { getCategoryColor } from "../utils/category-utils";
import { getPercentageInRange } from "../utils/format-utils";

type SensorCardProps = {
  sensor: PlaybackSensor;
  value: number;
  hasValue: boolean;
  gripIcon?: React.ReactNode;
  onClick?: () => void;
  isActive: boolean;
};

export function SensorCard({ sensor, value, hasValue, gripIcon, onClick, isActive }: SensorCardProps) {
  // Get color for gradient
  const categoryColor = getCategoryColor(sensor.category);
  const gradientFrom = `${categoryColor}10`;
  const gradientTo = `${categoryColor}30`;

  // Get value percentage for position calculation
  const valuePercentage = hasValue && sensor.minValue != null && sensor.maxValue != null
    ? getPercentageInRange(value, sensor.minValue, sensor.maxValue)
    : 50;

  // Constrain position to avoid cutoff at edges, but allow more movement
  const positionStyle = valuePercentage <= 8
    ? { left: "4%", transform: "translateX(-20%)" }
    : valuePercentage >= 92
      ? { left: "96%", transform: "translateX(-80%)" }
      : { left: `${valuePercentage}%`, transform: "translateX(-50%)" };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", duration: 0.5 }}
      className="h-full group"
      whileHover={{ scale: 1.01 }}
    >
      <Card
        className={cn(
          "overflow-hidden transition-all h-full relative",
          "hover:shadow-lg group-hover:translate-y-[-2px] transition-all duration-200",
          "bg-gradient-to-br border-2",
          isActive ? "ring-2 scale-[1.01]" : "ring-0 scale-100",
          "hover:shadow-md cursor-pointer",
        )}
        style={{
          borderColor: isActive ? categoryColor : "var(--border)",
          backgroundImage: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`,
          minHeight: "180px",
          boxShadow: isActive
            ? `0 0 0 1px ${categoryColor}40, 0 2px 4px ${categoryColor}20`
            : "none",
        }}
        onClick={onClick}
      >
        {/* Glowing effect on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, ${categoryColor}, transparent 70%)`,
            mixBlendMode: "soft-light",
          }}
        />

        {/* Grip icon for dragging */}
        {gripIcon && (
          <div className="absolute top-2 right-2 z-10 pointer-events-none">
            {gripIcon}
          </div>
        )}

        {/* Category indicator */}
        <div
          className="absolute top-0 left-0 h-full w-1.5"
          style={{ backgroundColor: categoryColor }}
        />

        <CardContent className="p-3 sm:p-5 flex flex-col h-full min-h-[180px]">
          <div className="flex items-start justify-between mb-auto">
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div
                  className="p-1 sm:p-1.5 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: `${categoryColor}20` }}
                >
                  {getCategoryIcon(sensor.category, "w-3.5 h-3.5 sm:w-4 sm:h-4")}
                </div>
                <Badge
                  variant="outline"
                  className="rounded-md font-medium text-[10px] sm:text-xs py-0.5"
                  style={{ borderColor: `${categoryColor}40`, color: categoryColor }}
                >
                  {sensor.category}
                </Badge>
              </div>
              <h3 className="font-semibold text-sm sm:text-base line-clamp-2">{sensor.name}</h3>
            </div>

            <motion.div
              className="text-lg sm:text-xl font-bold tabular-nums flex items-center h-full bg-background/70 backdrop-blur-sm px-2 rounded-md shadow-sm"
              animate={{
                scale: hasValue ? [1, 1.05, 1] : 1,
                transition: { duration: 0.3 },
              }}
              style={{ color: hasValue ? categoryColor : undefined }}
            >
              {hasValue ? Number(value.toFixed(2)) : "N/A"}
              <span className="text-xs sm:text-sm font-normal text-muted-foreground ml-1">
                {hasValue ? sensor.unit : ""}
              </span>
            </motion.div>
          </div>

          {sensor.minValue !== null && sensor.maxValue !== null && hasValue && (
            <div className="mt-4 sm:mt-6">
              <div className="relative pt-7 sm:pt-8 pb-2">
                <motion.div
                  className="absolute top-0 z-10"
                  style={positionStyle}
                  animate={{
                    left: positionStyle.left,
                    transition: { type: "spring", damping: 15 },
                  }}
                >
                  {/* Triangle pointer */}
                  <div
                    className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] sm:border-l-[6px] sm:border-l-transparent sm:border-r-[6px] sm:border-r-transparent sm:border-t-[6px] mx-auto"
                    style={{ borderTopColor: categoryColor }}
                  />

                  {/* Value label with improved visibility */}
                  <div
                    className="text-[9px] sm:text-xs rounded-sm px-1.5 sm:px-2 py-0.5 text-center font-medium shadow-sm border border-border"
                    style={{
                      backgroundColor: "hsl(var(--card))",
                      color: categoryColor,
                      boxShadow: `0 1px 3px rgba(0,0,0,0.1)`,
                      fontWeight: "bold",
                    }}
                  >
                    <span className="font-mono text-[9px] sm:text-[10px]">{Number(value.toFixed(2))}</span>
                  </div>
                </motion.div>

                <div className="mt-2 mx-2">
                  <Progress
                    value={getPercentageInRange(
                      hasValue ? value : 0,
                      sensor.minValue!,
                      sensor.maxValue!,
                    )}
                    className="h-2 sm:h-2.5 transition-all duration-300 rounded-full"
                    style={{
                      "backgroundColor": `${categoryColor}20`,
                      "--progress-foreground": categoryColor,
                      "border": "1px solid var(--border)",
                    } as React.CSSProperties}
                  />

                  <div className="flex justify-between text-[9px] sm:text-xs mt-1 sm:mt-1.5">
                    <span className="px-1 py-0.5 bg-background/80 rounded-sm border border-border font-medium text-[9px] sm:text-[10px]" style={{ color: categoryColor }}>
                      {sensor.minValue}
                      {" "}
                      {sensor.unit}
                    </span>
                    <span className="px-1 py-0.5 bg-background/80 rounded-sm border border-border font-medium text-[9px] sm:text-[10px]" style={{ color: categoryColor }}>
                      {sensor.maxValue}
                      {" "}
                      {sensor.unit}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
