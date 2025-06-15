import { Check, Search } from "lucide-react";
import { useState } from "react";

import type { GridSensorSelectorProps, Sensor } from "@/features/charts/types";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function GridSensorSelector({
  sensors,
  selectedSensorIds,
  onSensorChange,
  isLoading,
  maxSelections = 3,
  categoryColors,
}: GridSensorSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Toggle a sensor selection
  const toggleSensor = (sensorId: string) => {
    // If already selected, remove it
    if (selectedSensorIds.includes(sensorId)) {
      onSensorChange(selectedSensorIds.filter(id => id !== sensorId));
      return;
    }

    // If max selections reached, show a warning or replace the oldest selection
    if (selectedSensorIds.length >= maxSelections) {
      // Remove the first (oldest) selection and add the new one
      const newSelections = [...selectedSensorIds.slice(1), sensorId];
      onSensorChange(newSelections);
      return;
    }

    // Otherwise, add the new selection
    onSensorChange([...selectedSensorIds, sensorId]);
  };

  // Filter sensors based on search term
  const filteredSensors = searchTerm
    ? sensors.filter(sensor =>
        sensor.name.toLowerCase().includes(searchTerm.toLowerCase())
        || sensor.pid.toLowerCase().includes(searchTerm.toLowerCase())
        || sensor.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : sensors;

  // Group sensors by category
  const sensorsByCategory: Record<string, Sensor[]> = {};
  filteredSensors.forEach((sensor) => {
    if (!sensorsByCategory[sensor.category]) {
      sensorsByCategory[sensor.category] = [];
    }
    sensorsByCategory[sensor.category].push(sensor);
  });

  if (isLoading) {
    return <div className="h-[300px] w-full rounded-md border bg-card p-4">Loading sensors...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search sensors by name, PID, or category..."
          className="pl-8 w-full"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Sensors grid by category */}
      <ScrollArea className="h-[400px] rounded-md border">
        <div className="p-4 space-y-6">
          {Object.entries(sensorsByCategory).length === 0 && (
            <div className="flex items-center justify-center h-20 text-muted-foreground">
              No sensors found matching your search
            </div>
          )}

          {Object.entries(sensorsByCategory).map(([category, categorySensors]) => (
            <div key={category} className="space-y-2">
              <div
                className="text-sm font-medium px-1 py-0.5 rounded"
                style={{ color: categoryColors[category] || categoryColors.Other }}
              >
                {category}
                {" "}
                (
                {categorySensors.length}
                )
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {categorySensors.map((sensor) => {
                  const isSelected = selectedSensorIds.includes(sensor.pid);
                  return (
                    <Card
                      key={sensor.pid}
                      className={cn(
                        "cursor-pointer transition-all border-l-4 hover:bg-accent/50",
                        isSelected
                          ? "border-primary bg-accent"
                          : `border-l-[${categoryColors[sensor.category] || categoryColors.Other}]`,
                      )}
                      onClick={() => toggleSensor(sensor.pid)}
                      style={{
                        borderLeftColor: categoryColors[sensor.category] || categoryColors.Other,
                      }}
                    >
                      <div className="p-3 flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-sm truncate max-w-[180px]">
                              {sensor.name}
                            </span>
                            {isSelected && (
                              <Badge variant="default" className="ml-1 h-5 px-1">
                                <Check className="h-3 w-3" />
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <span>{sensor.pid}</span>
                            {sensor.unit && (
                              <>
                                <span>•</span>
                                <span>{sensor.unit}</span>
                              </>
                            )}
                          </div>
                        </div>
                        {sensor.lastValue !== null && (
                          <div className="text-xs font-medium">
                            {sensor.lastValue}
                            {" "}
                            {sensor.unit}
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>Click on a sensor to select/deselect it</span>
        <span>
          {selectedSensorIds.length}
          /
          {maxSelections}
          {" "}
          sensors selected
        </span>
      </div>
    </div>
  );
}
