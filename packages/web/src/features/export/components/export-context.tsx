import { parseAsString, useQueryState } from "nuqs";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { ColumnDefinition, DiagnosticItem, ExportFormat, ExportSelection } from "../types";

import { ExportStepId } from "../types";

type ExportContextType = {
  currentStep: ExportStepId;
  previousStep: ExportStepId | null;
  setCurrentStep: (step: ExportStepId) => void;
  selection: ExportSelection;
  setSelectedDiagnostics: (diagnostics: DiagnosticItem[]) => void;
  setExportFormat: (format: ExportFormat) => void;
  setSelectedColumns: (columns: ColumnDefinition[]) => void;
  setDateRange: (startDate: Date | null, endDate: Date | null) => void;
  setIncludeAllData: (include: boolean) => void;
  resetSelection: () => void;
};

const defaultSelection: ExportSelection = {
  diagnostics: [],
  format: "csv",
  columns: [],
  dateRange: {
    startDate: null,
    endDate: null,
  },
  includeAllData: true,
};

const ExportContext = createContext<ExportContextType | undefined>(undefined);

export function ExportProvider({ children }: { children: React.ReactNode }) {
  // Use React state for the step to maintain type safety
  const [currentStep, setCurrentStepState] = useState<ExportStepId>(ExportStepId.SelectDiagnostics);
  // Track previous step for animations
  const [previousStep, setPreviousStep] = useState<ExportStepId | null>(null);
  // Use nuqs for URL state with history: 'push' to create new history entries
  const [urlStep, setUrlStep] = useQueryState("step", parseAsString.withDefault(ExportStepId.SelectDiagnostics).withOptions({
    history: "push",
  }));
  const [selection, setSelection] = useState<ExportSelection>(defaultSelection);

  // Sync state with URL on component mount and when URL changes
  useEffect(() => {
    // Check if the URL step is valid and update local state if it is
    if (
      urlStep === ExportStepId.SelectDiagnostics
      || urlStep === ExportStepId.ConfigureExport
      || urlStep === ExportStepId.ReviewAndExport
    ) {
      // Only update if the step is changing
      if (currentStep !== urlStep) {
        setPreviousStep(currentStep);
        setCurrentStepState(urlStep as ExportStepId);
      }
    }
  }, [urlStep, currentStep]);

  // Set step function that updates both local state and URL
  const setCurrentStep = (step: ExportStepId) => {
    // Track the previous step before changing
    setPreviousStep(currentStep);
    setCurrentStepState(step);
    setUrlStep(step);
  };

  const setSelectedDiagnostics = (diagnostics: DiagnosticItem[]) => {
    setSelection(prev => ({ ...prev, diagnostics }));
  };

  const setExportFormat = (format: ExportFormat) => {
    setSelection(prev => ({ ...prev, format }));
  };

  const setSelectedColumns = (columns: ColumnDefinition[]) => {
    setSelection(prev => ({ ...prev, columns }));
  };

  const setDateRange = (startDate: Date | null, endDate: Date | null) => {
    setSelection(prev => ({
      ...prev,
      dateRange: { startDate, endDate },
    }));
  };

  const setIncludeAllData = (includeAllData: boolean) => {
    setSelection(prev => ({ ...prev, includeAllData }));
  };

  const resetSelection = () => {
    setSelection(defaultSelection);
    setPreviousStep(null);
    setCurrentStep(ExportStepId.SelectDiagnostics);
  };

  const value = useMemo(
    () => ({
      currentStep,
      previousStep,
      setCurrentStep,
      selection,
      setSelectedDiagnostics,
      setExportFormat,
      setSelectedColumns,
      setDateRange,
      setIncludeAllData,
      resetSelection,
    }),
    [currentStep, previousStep, selection],
  );

  return <ExportContext.Provider value={value}>{children}</ExportContext.Provider>;
}

export function useExport() {
  const context = useContext(ExportContext);
  if (context === undefined) {
    throw new Error("useExport must be used within an ExportProvider");
  }
  return context;
}
 