import { useParams } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// Import the diagnostic session selector from the sensors feature as we're reusing that component
import { DiagnosticSessionSelector } from "@/features/sensors/components/diagnostic-session-selector";

import { useGetVehicleDiagnostics } from "../api/use-get-vehicle-diagnostics";
import { pageVariants } from "../utils/animation-variants";
import { DTCsList } from "./dtcs-list";

export function DiagnosticsPage() {
  const { vehicleId } = useParams({ from: "/_authenticated/app/$vehicleId/diagnostics/" });

  // Store selected diagnostic in URL query parameters for persistence
  const [selectedDiagnosticId, setSelectedDiagnosticId] = useQueryState(
    "diagnosticId",
    parseAsString.withDefault(""),
  );

  // Fetch all diagnostics for the vehicle
  const {
    data: diagnosticsData,
    isLoading: isLoadingDiagnostics,
    error: diagnosticsError,
  } = useGetVehicleDiagnostics(vehicleId);

  // When diagnostics data is loaded, select the most recent diagnostic session by default
  // Only if no diagnostic is currently selected in the URL
  useEffect(() => {
    if (!isLoadingDiagnostics && diagnosticsData && diagnosticsData.length > 0 && !selectedDiagnosticId) {
      // Sort diagnostics by createdAt (newest first)
      const sortedDiagnostics = [...diagnosticsData].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      // Select the most recent diagnostic session
      setSelectedDiagnosticId(sortedDiagnostics[0].uuid);
    }
  }, [diagnosticsData, isLoadingDiagnostics, selectedDiagnosticId, setSelectedDiagnosticId]);

  // Handle diagnostic session change
  const handleDiagnosticSessionChange = (sessionId: string) => {
    setSelectedDiagnosticId(sessionId);
  };

  return (
    <motion.div
      className="container mx-auto p-4 lg:p-6 h-[calc(100vh-80px)] flex flex-col gap-4 lg:gap-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Simple selector toolbar */}
      <div className="flex justify-end">
        <DiagnosticSessionSelector
          sessions={diagnosticsData || []}
          selectedSession={selectedDiagnosticId || null}
          onSessionChange={handleDiagnosticSessionChange}
          isLoading={isLoadingDiagnostics}
        />
      </div>

      {/* Alert when no diagnostic is selected */}
      {!selectedDiagnosticId && !isLoadingDiagnostics && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No diagnostic session selected</AlertTitle>
          <AlertDescription>
            Please select a diagnostic session to view its trouble codes
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {diagnosticsError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load diagnostic sessions. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      {/* DTCs List - Full Width */}
      {selectedDiagnosticId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 overflow-hidden"
        >
          <DTCsList diagnosticId={selectedDiagnosticId} />
        </motion.div>
      )}
    </motion.div>
  );
}
