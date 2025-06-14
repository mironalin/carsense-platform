// Diagnostic Session Interface
export type DiagnosticSession = {
  uuid: string;
  createdAt: string;
  odometer: number;
  notes?: string | null;
};

// Sensor Reading Interface
export type SensorReading = {
  value: number;
  timestamp: string;
  diagnosticUUID: string;
  snapshotUUID: string;
  odometer: number;
};

// Sensor Interface
export type Sensor = {
  pid: string;
  name: string;
  unit: string;
  category: string;
  readings: SensorReading[];
  lastValue: number | null;
  minValue: number | null;
  maxValue: number | null;
};

// Chart Data Point Interface
export type ChartDataPoint = {
  timestamp: string;
  value: number;
  unit: string;
  diagnostic: string;
  odometer: number;
};

// Sensor Categories Record
export type CategoryRecord = {
  [key: string]: string[];
};

// Sensor Data Response Interface
export type SensorData = {
  sensors: Sensor[];
  categories: CategoryRecord;
  readings: any[];
  diagnostics: DiagnosticSession[];
  snapshots: any[];
  stats: {
    totalSensors: number;
    totalReadings: number;
    readingsPerCategory: Record<string, number>;
  };
};

// Chart Types
export type ChartType = "area" | "line" | "bar";

// Define the available color themes
export type ColorTheme = "default" | "vibrant" | "pastel" | "monochrome" | "neon";

// Chart Filter Props Interface
export type ChartFiltersProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (value: boolean) => void;
  resetFilters: () => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  categories: CategoryRecord;
  allSensors: Sensor[];
  chartType: ChartType;
  setChartType: (type: ChartType) => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  colorThemes: Record<string, { name: string; colors: Record<string, string> }>;
};

// Sensor Chart Props Interface
export type SensorChartProps = {
  data: SensorData | undefined;
  isLoading: boolean;
};

// Chart Config Interface
export type ChartConfig = {
  [key: string]: {
    label: string;
    color: string;
  };
};

// Sensor Chart Overview Props Interface
export type SensorChartOverviewProps = {
  data: SensorData | undefined;
  isLoading: boolean;
};
