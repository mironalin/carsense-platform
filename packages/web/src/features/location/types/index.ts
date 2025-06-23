export type LocationData = {
  uuid: string;
  diagnosticUUID: string;
  vehicleUUID: string;
  latitude: number;
  longitude: number;
  altitude?: number | null;
  speed?: number | null;
  accuracy?: number | null;
  timestamp: string;
};

export type LocationWithParsedDates = {
  timestamp: Date;
} & Omit<LocationData, "timestamp">;

export type DiagnosticOption = {
  uuid: string;
  createdAt: string;
  notes?: string | null;
  locationCount?: number;
};

export type RoutePathData = {
  path: [number, number][];
  startTime: Date;
  endTime: Date;
  totalDistance: number;
  maxSpeed: number;
  locations: LocationWithParsedDates[];
};
