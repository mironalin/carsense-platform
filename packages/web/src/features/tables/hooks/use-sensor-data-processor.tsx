import { useMemo } from "react";

import type { SensorApiResponse, SensorData } from "../types";

type SensorInfo = {
  pid: string;
  name?: string;
  category?: string;
  unit?: string;
  lastValue?: number;
};

type SensorTableData = {
  pid: string;
  name: string;
  category: string;
  data: SensorData[];
};

type UseSensorDataProcessorReturn = {
  allSensors: SensorInfo[];
  processedData: SensorData[];
  getSensorTables: (selectedSensorIds: string[]) => SensorTableData[];
};

export function useSensorDataProcessor(data: SensorApiResponse | undefined): UseSensorDataProcessorReturn {
  // Extract all unique sensors for the selector
  const allSensors = useMemo(() => {
    if (!data?.sensors)
      return [];

    return data.sensors.map(sensor => ({
      pid: sensor.pid,
      name: sensor.name,
      category: sensor.category || "Other",
      unit: sensor.unit,
      lastValue: sensor.lastValue,
    }));
  }, [data]);

  // Process the data for the table format
  const processedData = useMemo(() => {
    if (!data?.sensors || !Array.isArray(data.sensors)) {
      return [];
    }

    // Flatten sensor readings into table rows
    const tableData: SensorData[] = [];

    data.sensors.forEach((sensor) => {
      if (sensor.readings && Array.isArray(sensor.readings)) {
        sensor.readings.forEach((reading) => {
          tableData.push({
            pid: sensor.pid,
            name: sensor.name,
            value: reading.value,
            unit: sensor.unit,
            category: sensor.category,
            timestamp: reading.timestamp,
          });
        });
      }
      else {
        // If no readings, add a single entry with last value
        tableData.push({
          pid: sensor.pid,
          name: sensor.name,
          value: sensor.lastValue,
          unit: sensor.unit,
          category: sensor.category,
        });
      }
    });

    return tableData;
  }, [data]);

  // Function to get sensor tables data for selected sensors
  const getSensorTables = (selectedSensorIds: string[]): SensorTableData[] => {
    if (selectedSensorIds.length === 0)
      return [];

    return selectedSensorIds.map((sensorPid) => {
      const sensorData = processedData.filter(item => item.pid === sensorPid);
      const sensorInfo = allSensors.find((s: SensorInfo) => s.pid === sensorPid);

      return {
        pid: sensorPid,
        name: sensorInfo?.name || "Unknown Sensor",
        category: sensorInfo?.category || "Unknown",
        data: sensorData,
      };
    });
  };

  return {
    allSensors,
    processedData,
    getSensorTables,
  };
}
