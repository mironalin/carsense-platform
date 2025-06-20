export type ExportFormat = "csv" | "xlsx" | "json";

export type DiagnosticItem = {
  id: string;
  name: string;
  category: string;
  pid?: string;
  date?: string;
  odometer?: string;
  timestamp?: string;
  vehicleId?: string;
};

export type ColumnDefinition = {
  id: string;
  name: string;
  selected: boolean;
};

export type ExportSelection = {
  diagnostics: DiagnosticItem[];
  format: ExportFormat;
  columns: ColumnDefinition[];
  dateRange?: {
    startDate: Date | null;
    endDate: Date | null;
  };
  includeAllData?: boolean;
};

export type ExportStep = {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
};

export enum ExportStepId {
  SelectDiagnostics = "select-diagnostics",
  ConfigureExport = "configure-export",
  ReviewAndExport = "review-and-export",
}

export type ConfigureExportContentProps = {
  selectedTab: string;
  exportFormat: ExportFormat;
  columns: ColumnDefinition[];
  dateRange: { from: Date; to: Date };
  includeAllData: boolean;
  isLoading: boolean;
  availableDateRange: { min: Date | null; max: Date | null };
  onFormatChange: (format: ExportFormat) => void;
  onColumnToggle: (columnId: string) => void;
  onSelectAllColumns: () => void;
  onClearAllColumns: () => void;
  onDateRangeChange: (range: { from: Date; to: Date }) => void;
  onIncludeAllDataChange: (include: boolean) => void;
};
