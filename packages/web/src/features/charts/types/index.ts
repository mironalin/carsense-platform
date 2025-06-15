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
  isMultiSeries?: boolean;
  seriesConfig?: Record<string, { label: string; color: string }>;
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

// Sensor Chart Card Props Interface
export type SensorChartCardProps = {
  sensor: Sensor;
  chartData: any[];
  categoryColor: string;
  chartType: ChartType;
  index: number;
  isFavorite?: boolean;
  isVisible?: boolean;
  onFavoriteToggle?: () => void;
  onFullScreen?: () => void;
  onChartClick?: (data: any) => void;
  isComparisonMode?: boolean;
  availableChartTypes?: ChartType[];
  onChartTypeChange?: (chartType: ChartType) => void;
};

// Extended sensor type to include multi-series properties
export type ExtendedSensor = {
  isMultiSeries?: boolean;
  seriesConfig?: Record<string, { label: string; color: string }>;
  multiSeriesData?: any[];
} & Sensor;

// Area Chart Component Props Interface
export type AreaChartComponentProps = {
  sensor: ExtendedSensor;
  chartData: any[];
  categoryColor: string;
  onClick: (data: any) => void;
  className?: string;
};

// Bar Chart Component Props Interface
export type BarChartComponentProps = {
  sensor: ExtendedSensor;
  chartData: any[];
  categoryColor: string;
  onClick: (data: any) => void;
  className?: string;
};

// Line Chart Component Props Interface
export type LineChartComponentProps = {
  sensor: ExtendedSensor;
  chartData: any[];
  categoryColor: string;
  onClick: (data: any) => void;
  className?: string;
};

// Chart Renderer Props Interface
export type ChartRendererProps = {
  sensor: ExtendedSensor;
  chartData: any[];
  chartType: ChartType;
  categoryColor: string;
  onClick?: (data: any) => void;
  className?: string;
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

// Comparison Feature Types

// Multi Diagnostic Session Selector Props Interface
export type MultiDiagnosticSessionSelectorProps = {
  sessions: DiagnosticSession[];
  selectedSessions: string[];
  onSessionsChange: (sessionIds: string[]) => void;
  isLoading: boolean;
  maxSelections?: number;
};

// Comparison Chart Data Point Interface (extends ChartDataPoint with diagnostic session info)
export type ComparisonChartDataPoint = ChartDataPoint & {
  diagnosticId: string;
  diagnosticDate: string;
};

// Sensor Chart Comparison Props Interface
export type SensorChartComparisonProps = {
  data: Record<string, SensorData> | undefined;
  isLoading: boolean;
  selectedSessions: string[];
};

// Comparison Preferences Interface
export type ComparisonPreferences = {
  selectedSensorIds: string[];
  updateSelectedSensors: (sensorIds: string[]) => void;
  selectedSessionIds: string[];
  updateSelectedSessions: (sessionIds: string[]) => void;
};

// Grid Sensor Selector Props Interface
export type GridSensorSelectorProps = {
  sensors: Sensor[];
  selectedSensorIds: string[];
  onSensorChange: (sensorIds: string[]) => void;
  isLoading: boolean;
  maxSelections?: number;
  categoryColors: Record<string, string>;
};

// Sensor Selector Props Interface
export type SensorSelectorProps = {
  sensors: Sensor[];
  selectedSensorIds: string[];
  onSensorChange: (sensorIds: string[]) => void;
  isLoading: boolean;
  maxSelections?: number;
  categoryColors: Record<string, string>;
};

// Define the type for normalized data points
export type NormalizedDataPoint = {
  index: number;
  pointNumber: number; // 1-indexed point number for display
  timestamp: string;
  // Add timestamps for each session
  sessionTimestamps?: Record<string, string>;
  [sessionId: string]: number | string | Record<string, string> | undefined;
};

// Chart Controls Props Interface
export type ChartControlsProps = {
  chartType: ChartType;
  onChartTypeChange: (value: ChartType) => void;
  colorTheme: ColorTheme;
  onColorThemeChange: (value: ColorTheme) => void;
};

// Chart Type Selector Props Interface
export type ChartTypeSelectorProps = {
  chartType: ChartType;
  onChartTypeChange: (value: ChartType) => void;
};

// Color Theme Selector Props Interface
export type ColorThemeSelectorProps = {
  colorTheme: ColorTheme;
  onColorThemeChange: (value: ColorTheme) => void;
};

// Full Screen Chart Dialog Props Interface
export type FullScreenChartDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  sensor: Sensor | null;
  chartData: any[];
  chartType: ChartType;
  categoryColor: string;
};
