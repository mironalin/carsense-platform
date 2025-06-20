import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";

import type { PlaybackSensorSelectorProps } from "@/features/sensors/playback/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { getCategoryIcon, groupSensorsByCategory, STANDARD_CATEGORIES } from "../../utils/sensor-categories";

export function SensorSelector({
  sensors,
  selectedSensors,
  onToggleSensor,
  onSelectAll,
  onClearAll,
  isMinimized,
  onToggleMinimize,
}: PlaybackSensorSelectorProps) {
  // Group sensors by category
  const groupedSensors = groupSensorsByCategory(sensors);

  // Handle button clicks without triggering the header click
  const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
    e.stopPropagation();
    callback();
  };

  return (
    <Card className="transition-all duration-300 ease-in-out shadow-sm border">
      <CardContent className="">
        <div className="flex items-center justify-between cursor-pointer" onClick={onToggleMinimize}>
          <h3 className="text-sm font-medium flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Select Sensors to Display
            <Badge variant="outline" className="ml-1.5 text-xs px-1.5 py-0">
              {selectedSensors.length}
              {" "}
              selected
            </Badge>
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={e => handleButtonClick(e, onClearAll)}
              disabled={selectedSensors.length === 0}
              className="h-8 text-xs"
            >
              Clear All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={e => handleButtonClick(e, onSelectAll)}
              disabled={sensors.length === 0 || selectedSensors.length === sensors.length}
              className="h-8 text-xs"
            >
              Select All
            </Button>
            <div className="flex items-center justify-center h-8 w-8">
              {isMinimized ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </div>
          </div>
        </div>

        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isMinimized ? "max-h-0 opacity-0" : "max-h-[340px] opacity-100 mt-4"}`}>
          <ScrollArea className="pr-2 -mr-2">
            <div className="space-y-4">
              {/* Standard categories first */}
              {STANDARD_CATEGORIES.map((category) => {
                const categorySensors = groupedSensors[category];
                if (!categorySensors || categorySensors.length === 0)
                  return null;

                return (
                  <div key={category} className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-sm font-medium pb-1 border-b">
                      <div className="text-muted-foreground">
                        {getCategoryIcon(category, "h-4 w-4")}
                      </div>
                      <span className="capitalize">{category}</span>
                      <Badge variant="outline" className="ml-1.5 text-xs px-1.5 py-0">
                        {categorySensors.length}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
                      {categorySensors.map(sensor => (
                        <div
                          key={sensor.pid}
                          className={`
                            flex items-center justify-between px-2 py-1.5 rounded 
                            ${selectedSensors.includes(sensor.pid)
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-muted/40 border border-muted hover:bg-muted/60"}
                            transition-colors cursor-pointer
                          `}
                          onClick={() => onToggleSensor(sensor.pid)}
                        >
                          <span className="text-xs font-medium truncate max-w-[160px]">
                            {sensor.name || "Unknown Sensor"}
                          </span>
                          <div
                            className={`
                              w-3 h-3 rounded-full ml-2 flex-shrink-0
                              ${selectedSensors.includes(sensor.pid)
                          ? "bg-primary"
                          : "bg-muted-foreground/30"}
                            `}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Other categories */}
              {Object.keys(groupedSensors)
                .filter(category => !STANDARD_CATEGORIES.includes(category))
                .map((category) => {
                  const categorySensors = groupedSensors[category];
                  if (!categorySensors || categorySensors.length === 0)
                    return null;

                  return (
                    <div key={category} className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-sm font-medium pb-1 border-b">
                        <div className="text-muted-foreground">
                          {getCategoryIcon(category, "h-4 w-4")}
                        </div>
                        <span className="capitalize">{category}</span>
                        <Badge variant="outline" className="ml-1.5 text-xs px-1.5 py-0">
                          {categorySensors.length}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
                        {categorySensors.map(sensor => (
                          <div
                            key={sensor.pid}
                            className={`
                              flex items-center justify-between px-2 py-1.5 rounded 
                              ${selectedSensors.includes(sensor.pid)
                            ? "bg-primary/10 border border-primary/30"
                            : "bg-muted/40 border border-muted hover:bg-muted/60"}
                              transition-colors cursor-pointer
                            `}
                            onClick={() => onToggleSensor(sensor.pid)}
                          >
                            <span className="text-xs font-medium truncate max-w-[160px]">
                              {sensor.name || "Unknown Sensor"}
                            </span>
                            <div
                              className={`
                                w-3 h-3 rounded-full ml-2 flex-shrink-0
                                ${selectedSensors.includes(sensor.pid)
                            ? "bg-primary"
                            : "bg-muted-foreground/30"}
                              `}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
