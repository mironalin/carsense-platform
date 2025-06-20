import type { DragEndEvent } from "@dnd-kit/core";

import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { GripIcon } from "lucide-react";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import type { PlaybackSensor, SensorPlaybackProps } from "../types";

import { useSensorPlayback } from "../hooks/use-sensor-playback";
import { PlaybackControls } from "./playback-controls";
import { PlaybackTimeline } from "./playback-timeline";
import { SensorSelector } from "./sensor-selector";
import { SortableSensorCard } from "./sortable-sensor-card";

export function SensorPlayback({ data, isLoading }: SensorPlaybackProps) {
  const [
    {
      isPlaying,
      playbackSpeed,
      isLooping,
      progress,
      elapsedTime,
      selectedSensors,
      sensorOrder,
      sensorValues,
      timestamps,
      timeRange,
      currentTime,
      sensors,
    },
    controls,
  ] = useSensorPlayback({ data, isLoading });

  const [isSelectorMinimized, setIsSelectorMinimized] = useState(() => {
    // Check if we have a saved preference in local storage
    const savedPreference = localStorage.getItem("sensorSelectorMinimized");
    return savedPreference === "true";
  });

  // Toggle minimized state and save preference
  const handleToggleMinimize = () => {
    setIsSelectorMinimized((prev) => {
      const newState = !prev;
      localStorage.setItem("sensorSelectorMinimized", String(newState));
      return newState;
    });
  };

  // Setup DND sensors
  const dndSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
        tolerance: 5,
        delay: 50,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sensorOrder.indexOf(active.id as string);
      const newIndex = sensorOrder.indexOf(over.id as string);

      const newOrder = arrayMove(sensorOrder, oldIndex, newIndex);
      controls.reorderSensors(newOrder);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="overflow-hidden">
          <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
            <CardTitle>Sensor Playback</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-8 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (timestamps.length === 0) {
    return (
      <div className="space-y-4">
        <Card className="overflow-hidden">
          <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
            <CardTitle>Sensor Playback</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">No sensor data available for playback</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter visible sensors based on selection and order them based on sensorOrder
  const visibleSensors = sensors
    .filter(sensor => selectedSensors.includes(sensor.pid))
    .sort((a, b) => {
      const indexA = sensorOrder.indexOf(a.pid);
      const indexB = sensorOrder.indexOf(b.pid);

      // If not in order array, put at the end
      if (indexA === -1)
        return 1;
      if (indexB === -1)
        return -1;

      return indexA - indexB;
    });

  return (
    <div className="space-y-4">
      <TooltipProvider>
        <Card className="overflow-hidden">
          <CardHeader className="px-4 py-3 sm:px-6 sm:py-4 pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center flex-wrap gap-2">
                <h2 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text">
                  Sensor Playback
                </h2>
                <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                  {selectedSensors.length}
                  {" "}
                  Sensors
                </span>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-sm text-muted-foreground cursor-default">
                    <GripIcon className="h-4 w-4 mr-1" />
                    <span>Drag to reorder</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" align="center" className="sm:hidden">
                  <p>Drag sensor cards to rearrange</p>
                </TooltipContent>
                <TooltipContent side="right" className="hidden sm:block">
                  <p>Drag sensor cards to rearrange</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>

          <CardContent className="p-3 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Playback progress */}
              <PlaybackTimeline
                elapsedTime={elapsedTime}
                timeRange={timeRange}
                progress={progress}
                currentTime={currentTime}
                onSliderChange={controls.handleSliderChange}
              />

              {/* Playback controls */}
              <PlaybackControls
                isPlaying={isPlaying}
                playbackSpeed={playbackSpeed}
                isLooping={isLooping}
                onPlay={controls.play}
                onPause={controls.pause}
                onStop={controls.stop}
                onRestart={controls.restart}
                onLoopToggle={controls.toggleLoop}
                onSpeedChange={controls.setPlaybackSpeed}
              />

              {/* Sensor values with drag and drop */}
              <DndContext
                sensors={dndSensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={visibleSensors.map(sensor => sensor.pid)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4">
                    {visibleSensors.map((sensor: PlaybackSensor) => {
                      const value = sensorValues[sensor.pid];
                      const hasValue = value !== undefined;

                      return (
                        <SortableSensorCard
                          key={sensor.pid}
                          id={sensor.pid}
                          sensor={sensor}
                          value={value}
                          hasValue={hasValue}
                        />
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Sensor selection */}
              <SensorSelector
                sensors={sensors}
                selectedSensors={selectedSensors}
                onToggleSensor={controls.toggleSensor}
                onSelectAll={controls.selectAllSensors}
                onClearAll={controls.clearAllSensors}
                isMinimized={isSelectorMinimized}
                onToggleMinimize={handleToggleMinimize}
              />
            </div>
          </CardContent>
        </Card>
      </TooltipProvider>
    </div>
  );
}
