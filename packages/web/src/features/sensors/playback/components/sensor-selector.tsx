import { SlidersHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { PlaybackSensor } from "../types";

import { getCategoryIcon, groupSensorsByCategory, STANDARD_CATEGORIES } from "../../utils/sensor-categories";

type SensorSelectorProps = {
  sensors: PlaybackSensor[];
  selectedSensors: string[];
  onToggleSensor: (pid: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
};

export function SensorSelector({
  sensors,
  selectedSensors,
  onToggleSensor,
  onSelectAll,
  onClearAll,
}: SensorSelectorProps) {
  // Group sensors by category
  const groupedSensors = groupSensorsByCategory(sensors);

  return (
    <div className="mt-4 sm:mt-6 border rounded-lg p-3 sm:p-4 bg-card">
      <h3 className="text-sm font-medium mb-2 sm:mb-3 flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4" />
        Select Sensors to Display
      </h3>

      <ScrollArea className="max-h-[320px] sm:max-h-none pr-2 -mr-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {/* Standard categories first */}
          {STANDARD_CATEGORIES.map((category) => {
            // Find sensors in this category
            const categorySensors = groupedSensors[category.toLowerCase()] || [];

            // Skip empty categories that have no sensors
            if (categorySensors.length === 0)
              return null;

            return (
              <div key={category} className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  {getCategoryIcon(category)}
                  <span className="capitalize">{category}</span>
                </div>
                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                  {categorySensors.map(sensor => (
                    <Badge
                      key={sensor.pid}
                      variant={selectedSensors.includes(sensor.pid) ? "default" : "outline"}
                      className="cursor-pointer transition-all text-[10px] sm:text-xs py-0.5 px-1.5 sm:px-2"
                      onClick={() => onToggleSensor(sensor.pid)}
                    >
                      {sensor.name}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Any other non-standard categories */}
          {Object.entries(groupedSensors)
            .filter(([category]) => !STANDARD_CATEGORIES.map(c => c.toLowerCase()).includes(category))
            .map(([category, categorySensors]) => (
              <div key={category} className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  {getCategoryIcon(category)}
                  <span className="capitalize">{category}</span>
                </div>
                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                  {categorySensors.map(sensor => (
                    <Badge
                      key={sensor.pid}
                      variant={selectedSensors.includes(sensor.pid) ? "default" : "outline"}
                      className="cursor-pointer transition-all text-[10px] sm:text-xs py-0.5 px-1.5 sm:px-2"
                      onClick={() => onToggleSensor(sensor.pid)}
                    >
                      {sensor.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </ScrollArea>

      <div className="flex justify-between mt-3 sm:mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAll}
          className="text-[10px] sm:text-xs h-7 sm:h-8"
        >
          Clear All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onSelectAll}
          className="text-[10px] sm:text-xs h-7 sm:h-8"
        >
          Select All
        </Button>
      </div>
    </div>
  );
}
