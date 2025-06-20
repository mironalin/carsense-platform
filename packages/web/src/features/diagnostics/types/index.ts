/**
 * Type representing a Diagnostic Trouble Code (DTC) associated with a diagnostic session
 */
export type DiagnosticDTC = {
  uuid: string;
  diagnosticUUID: string;
  code: string;
  confirmed: boolean;
  createdAt: string;
  updatedAt: string;
};

/**
 * Type for DTCs with extra information from the library
 */
export type DiagnosticDTCWithInfo = {
  description?: string;
  severity?: "low" | "medium" | "high";
  affectedSystem?: string;
  category?: string;
} & DiagnosticDTC;

/**
 * Props for the diagnostics list component
 */
export type DiagnosticsListProps = {
  vehicleId: string;
  isLoading?: boolean;
  error?: Error | null;
  onSelectDiagnostic: (diagnosticId: string) => void;
  selectedDiagnosticId?: string;
};

/**
 * Props for the diagnostics details component
 */
export type DiagnosticDetailsProps = {
  diagnosticId: string;
  isLoading?: boolean;
  error?: Error | null;
};

/**
 * Props for the DTCs list component
 */
export type DTCsListProps = {
  diagnosticId: string;
  isLoading?: boolean;
  error?: Error | null;
};

/**
 * Props for the DTC item component
 */
export type DTCItemProps = {
  dtc: DiagnosticDTCWithInfo;
};
