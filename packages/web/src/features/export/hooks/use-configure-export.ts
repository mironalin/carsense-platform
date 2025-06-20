import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import type { ColumnDefinition, ExportFormat } from "../types";

import { useGetDiagnosticData } from "../api/use-get-diagnostic-data";
import { useExport } from "../components/export-context";
import { ExportStepId } from "../types";

export function useConfigureExport() {
  const { vehicleId } = useParams({ from: "/_authenticated/app/$vehicleId/export/" });
  const { setCurrentStep, selection, setExportFormat, setSelectedColumns, setDateRange, setIncludeAllData } = useExport();

  const [exportFormat, setLocalExportFormat] = useState<ExportFormat>(selection.format);
  const [columns, setLocalColumns] = useState<ColumnDefinition[]>(
    selection.columns.length > 0
      ? selection.columns
      : [
          { id: "pid", name: "PID", selected: true },
          { id: "name", name: "Sensor Name", selected: true },
          { id: "value", name: "Value", selected: true },
          { id: "unit", name: "Unit", selected: true },
          { id: "category", name: "Category", selected: true },
          { id: "timestamp", name: "Timestamp", selected: true },
          { id: "diagnosticId", name: "Diagnostic ID", selected: false },
          { id: "snapshotId", name: "Snapshot ID", selected: false },
          { id: "odometer", name: "Odometer", selected: true },
          { id: "notes", name: "Notes", selected: false },
          { id: "vehicleId", name: "Vehicle ID", selected: false },
        ],
  );

  const [selectedTab, setSelectedTab] = useState("format");
  const [dateRange, setLocalDateRange] = useState({
    from: selection.dateRange?.startDate || new Date(),
    to: selection.dateRange?.endDate || new Date(),
  });
  const [includeAllData, setLocalIncludeAllData] = useState(selection.includeAllData || false);

  // Available tabs
  const tabs = ["format", "columns", "daterange"];

  // Fetch diagnostic data to get the date range
  const { data: diagnosticResponse, isLoading } = useGetDiagnosticData({
    vehicleId,
    diagnosticIds: selection.diagnostics.map(diag => diag.id),
    includeAllData: true,
  });

  // Date range information from the diagnostics
  const [availableDateRange, setAvailableDateRange] = useState<{
    min: Date | null;
    max: Date | null;
  }>({ min: null, max: null });

  // Update the available date range when data loads
  useEffect(() => {
    if (diagnosticResponse?.dateRange) {
      setAvailableDateRange(diagnosticResponse.dateRange);

      // If we don't have dates set yet, initialize with the available range
      if (!selection.dateRange?.startDate && !selection.dateRange?.endDate) {
        if (diagnosticResponse.dateRange.min && diagnosticResponse.dateRange.max) {
          setLocalDateRange({
            from: diagnosticResponse.dateRange.min,
            to: diagnosticResponse.dateRange.max,
          });
        }
      }
    }
  }, [diagnosticResponse?.dateRange, selection.dateRange?.startDate, selection.dateRange?.endDate]);

  const handleBack = () => {
    setCurrentStep(ExportStepId.SelectDiagnostics);
  };

  const handleNext = () => {
    // Save all selections to the context
    setExportFormat(exportFormat);
    setSelectedColumns(columns);
    setDateRange(dateRange.from, dateRange.to);
    setIncludeAllData(includeAllData);

    // Navigate to review step
    setCurrentStep(ExportStepId.ReviewAndExport);
  };

  const handleColumnToggle = (columnId: string) => {
    setLocalColumns(prev =>
      prev.map(col =>
        col.id === columnId ? { ...col, selected: !col.selected } : col,
      ),
    );
  };

  const handleSelectAllColumns = () => {
    setLocalColumns(prev => prev.map(col => ({ ...col, selected: true })));
  };

  const handleClearAllColumns = () => {
    setLocalColumns(prev => prev.map(col => ({ ...col, selected: false })));
  };

  return {
    tabs,
    selectedTab,
    setSelectedTab,
    exportFormat,
    columns,
    dateRange,
    includeAllData,
    isLoading,
    availableDateRange,
    handleBack,
    handleNext,
    handleColumnToggle,
    handleSelectAllColumns,
    handleClearAllColumns,
    setLocalExportFormat,
    setLocalDateRange,
    setLocalIncludeAllData,
  };
}
