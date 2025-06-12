import type { ReactNode } from "react";

// Type for sensor data received from API
export type SensorData = {
  pid?: string;
  name?: string;
  lastValue?: number | null;
  unit?: string;
  category?: string;
  readings?: SensorReading[];
  minValue?: number | null;
  maxValue?: number | null;
  snapshotReadings?: SensorReading[]; // Readings from the current snapshot
};

// Type for a single sensor reading
export type SensorReading = {
  value: number | null;
  timestamp: string;
  snapshotUUID?: string;
  diagnosticUUID?: string;
  pid?: string;
  unit?: string;
};

// Type for a sensor snapshot
export type SensorSnapshot = {
  uuid: string;
  diagnosticUUID: string;
  createdAt: string;
  source?: string;
  readings?: SensorReading[];
};

// Type for processed sensor data for rendering
export type SensorCardData = {
  title: string;
  sensor: SensorData;
  unit: string;
  categoryIcon: ReactNode;
  category: string;
  delay: number;
};

// Type for the main component props - updated to match the actual data structure
export type SensorOverviewCardsProps = {
  data: {
    sensors?: SensorData[];
    categories?: { [key: string]: string[] };
    readings?: any[];
    diagnostics?: any[];
    snapshots?: SensorSnapshot[];
    stats?: {
      totalSensors: number;
      totalReadings: number;
      readingsPerCategory: { [key: string]: number };
    };
  } | undefined;
  isLoading: boolean;
};

// Type for SensorCard component props
export type SensorCardProps = {
  title: string;
  value: number | null;
  unit: string;
  categoryIcon: ReactNode;
  category: string;
  isLoading: boolean;
  trend?: "up" | "down" | "stable";
  minValue?: number | null;
  maxValue?: number | null;
  timestamp?: string;
  readings?: SensorReading[];
  snapshotReadings?: SensorReading[]; // Readings from the current snapshot
  delayAnimation?: number;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

// Type for SensorFilters component props
export type SensorFiltersProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (show: boolean) => void;
  uniqueCategories: string[];
  allSensorData: SensorCardData[];
  resetFilters: () => void;
  categories?: string[];
  selectedCategory?: string;
  onCategoryChange?: (value: string) => void;
  selectedVehicle?: string | null;
  vehicles?: { id: string; name: string; make?: string; model?: string; year?: number; status: string }[];
  onVehicleChange?: (value: string) => void;
};

// Type for MiniHistoryChart component props
export type MiniHistoryChartProps = {
  readings?: SensorReading[];
  unit: string;
};

// Type for SensorHistoryDialog component props
export type SensorHistoryDialogProps = {
  title: string;
  readings?: SensorReading[];
  unit: string;
};

// Type for AnimatedCounter component props
export type AnimatedCounterProps = {
  value: number | null;
  unit: string;
  duration?: number;
};

// Type for SnapshotNavigation component props
export type SnapshotNavigationProps = {
  snapshots: SensorSnapshot[];
  currentSnapshotIndex: number;
  onSnapshotChange: (index: number) => void;
};

// Type for ReadingNavigation component props
export type ReadingNavigationProps = {
  readings: SensorReading[];
  currentReadingIndex: number;
  onReadingChange: (index: number) => void;
};

// Types for data freshness
export type DataFreshness = "recent" | "stale" | "old";
