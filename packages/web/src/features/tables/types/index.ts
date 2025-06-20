// Type for a single sensor reading in tables view
export type SensorDataReading = {
  value: number | null;
  timestamp: string;
  snapshotUUID?: string;
  diagnosticUUID?: string;
  pid?: string;
  unit?: string;
};

// Type for sensor data in tables view
export type SensorData = {
  pid?: string;
  name?: string;
  value?: number | null;
  unit?: string;
  category?: string;
  timestamp?: string;
  diagnosticUUID?: string;
  snapshotUUID?: string;
};

// Type for an individual sensor reading in the API response
export type SensorReadingApi = {
  value: number;
  timestamp: string;
};

// Type for a single sensor in the API response
export type SensorApi = {
  pid: string;
  name?: string;
  category?: string;
  unit?: string;
  lastValue?: number;
  readings?: SensorReadingApi[];
};

// Type for the complete API response
export type SensorApiResponse = {
  sensors: SensorApi[];
  // Add any other fields that might be in the response
};
