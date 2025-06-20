import { useMemo } from "react";

import type { PlaybackSensor } from "@/features/sensors/playback/types";

import { Card, CardContent } from "@/components/ui/card";
import { SensorSelector } from "@/features/sensors/playback/components/sensor-selector";

import type { SensorApiResponse } from "../types";

import { useSelectedSensors } from "../hooks/use-selected-sensors";
import { useSensorDataProcessor } from "../hooks/use-sensor-data-processor";
import { NoSensorsSelected } from "./no-sensors-selected";
import { SensorDataTable } from "./sensor-data-table";
import { TableSelectionProvider } from "./table-selection-context";

type SensorTablesViewProps = {
  data: SensorApiResponse | undefined;
  isLoading: boolean;
};

export function SensorTablesView({ data, isLoading }: SensorTablesViewProps) {
  // Use our custom hooks to manage state and process data
  const {
    selectedSensors,
    handleToggleSensor,
    handleSelectAll,
    handleClearAll,
    isSelectorMinimized,
    handleToggleMinimize,
  } = useSelectedSensors();

  // Process sensor data using our custom hook
  const { allSensors, getSensorTables } = useSensorDataProcessor(data);

  // Get sensor table data for the selected sensors
  const sensorTables = useMemo(
    () => getSensorTables(selectedSensors),
    [selectedSensors, getSensorTables],
  );

  // Convert our SensorInfo[] to PlaybackSensor[] for the SensorSelector
  const playbackSensors: PlaybackSensor[] = useMemo(() => {
    return allSensors.map(sensor => ({
      pid: sensor.pid,
      name: sensor.name || "Unknown Sensor",
      unit: sensor.unit || "",
      category: sensor.category || "Other",
      readings: [], // Empty readings array as it's not used by the selector
      lastValue: sensor.lastValue,
    }));
  }, [allSensors]);

  return (
    <TableSelectionProvider>
      <div className="space-y-6">
        {/* Sensor Selector Component */}
        <SensorSelector
          sensors={playbackSensors}
          selectedSensors={selectedSensors}
          onToggleSensor={handleToggleSensor}
          onSelectAll={() => handleSelectAll(allSensors.map(s => s.pid))}
          onClearAll={handleClearAll}
          isMinimized={isSelectorMinimized}
          onToggleMinimize={handleToggleMinimize}
        />

        {/* Display tables for selected sensors */}
        <Card>
          <CardContent>
            {selectedSensors.length === 0
              ? (
                  <NoSensorsSelected />
                )
              : (
                  <div className="space-y-8">
                    {sensorTables.map(sensor => (
                      <SensorDataTable
                        key={sensor.pid}
                        data={sensor.data}
                        isLoading={isLoading}
                        title={sensor.name}
                        category={sensor.category}
                      />
                    ))}
                  </div>
                )}
          </CardContent>
        </Card>
      </div>
    </TableSelectionProvider>
  );
}
