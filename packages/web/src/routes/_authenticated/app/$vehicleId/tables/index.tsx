import { createFileRoute, Link } from "@tanstack/react-router";
import { ChartBar, Grid3X3, LineChart } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useGetVehicleSensorData } from "@/features/sensors/api/use-get-vehicle-sensor-data";
import { DiagnosticSessionSelector } from "@/features/sensors/components/diagnostic-session-selector";
import { SensorTablesView } from "@/features/tables/components/sensor-tables-view";
import { useGetVehicleDiagnostics } from "@/features/vehicles/api/use-get-vehicle-diagnostics";

export const Route = createFileRoute("/_authenticated/app/$vehicleId/tables/")({
  component: TablesPage,
});

function TablesPage() {
  const { vehicleId } = Route.useParams();

  // Get diagnosticId from query param
  const [diagnosticId, setDiagnosticId] = useQueryState(
    "diagnosticId",
    parseAsString.withDefault(""),
  );

  // Fetch diagnostics for the vehicle
  const {
    data: diagnosticsData,
    isLoading: isLoadingDiagnostics,
    error: diagnosticsError,
  } = useGetVehicleDiagnostics(vehicleId);

  // Fetch sensor data using diagnosticId
  const {
    data: sensorData,
    isLoading: isLoadingSensorData,
    error: sensorDataError,
  } = useGetVehicleSensorData(vehicleId, {
    diagnosticId: diagnosticId || undefined,
  });

  // Set first diagnosticId if none is selected and data is available
  useEffect(() => {
    if (
      !diagnosticId
      && !isLoadingDiagnostics
      && diagnosticsData
      && diagnosticsData.length > 0
    ) {
      const lastDiagnostic = diagnosticsData[0];
      setDiagnosticId(lastDiagnostic.uuid);
    }
  }, [diagnosticId, isLoadingDiagnostics, diagnosticsData, setDiagnosticId]);

  // Handle diagnostic session change
  const handleDiagnosticSessionChange = (sessionId: string) => {
    setDiagnosticId(sessionId);
  };

  // Error handling
  if (diagnosticsError || sensorDataError) {
    return (
      <div className="space-y-4 p-4 lg:p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {diagnosticsError?.message || sensorDataError?.message || "An error occurred."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Handle case where no diagnostics are available
  if (!isLoadingDiagnostics && (!diagnosticsData || diagnosticsData.length === 0)) {
    return (
      <div className="space-y-4 p-4 lg:p-6">
        <Alert className="mt-4">
          <AlertTitle>No diagnostic data available</AlertTitle>
          <AlertDescription className="flex flex-col gap-4">
            <p>
              This vehicle doesn't have any diagnostic data available. You'll need
              to run a diagnostic session first.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link to="/app/$vehicleId/sensors" params={{ vehicleId }}>
                <Button variant="outline" size="sm">
                  <ChartBar className="mr-2 h-4 w-4" />
                  Go to Sensors
                </Button>
              </Link>
              <Link to="/app/$vehicleId/charts" params={{ vehicleId }}>
                <Button variant="outline" size="sm">
                  <LineChart className="mr-2 h-4 w-4" />
                  Go to Charts
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <DiagnosticSessionSelector
          sessions={diagnosticsData || []}
          selectedSession={diagnosticId || null}
          onSessionChange={handleDiagnosticSessionChange}
          isLoading={isLoadingDiagnostics}
        />

        <div className="flex items-center gap-2">
          <Link to="/app/$vehicleId/sensors" params={{ vehicleId }}>
            <Button variant="outline" size="sm">
              <ChartBar className="mr-2 h-4 w-4" />
              Sensors View
            </Button>
          </Link>
          <Link to="/app/$vehicleId/charts" params={{ vehicleId }}>
            <Button variant="outline" size="sm">
              <LineChart className="mr-2 h-4 w-4" />
              Charts View
            </Button>
          </Link>
        </div>
      </div>

      <SensorTablesView
        data={sensorData}
        isLoading={isLoadingDiagnostics || isLoadingSensorData || !diagnosticId}
      />
    </div>
  );
}
