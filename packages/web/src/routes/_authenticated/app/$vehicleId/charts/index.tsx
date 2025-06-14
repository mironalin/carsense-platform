import { createFileRoute, Link } from "@tanstack/react-router";
import { ChartBar, Grid3X3, LineChart, PlayIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SensorChartComparison } from "@/features/charts/comparison/components/sensor-chart-comparison";
import { SensorChartOverview } from "@/features/charts/overview/components/sensor-chart-overview";
import { useGetVehicleSensorData } from "@/features/sensors/api/use-get-vehicle-sensor-data";
import { DiagnosticSessionSelector } from "@/features/sensors/components/diagnostic-session-selector";
import { useGetVehicleDiagnostics } from "@/features/vehicles/api/use-get-vehicle-diagnostics";

export const Route = createFileRoute("/_authenticated/app/$vehicleId/charts/")({
  component: ChartsPage,
});

function ChartsPage() {
  const { vehicleId } = Route.useParams();

  // Store active tab and selected diagnostic in URL query parameters
  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsString.withDefault("overview"),
  );

  // For diagnostic ID, use nullable string
  const [selectedDiagnosticId, setSelectedDiagnosticId] = useQueryState(
    "diagnosticId",
    parseAsString.withDefault(""),
  );

  // Fetch all diagnostics for the vehicle
  const {
    data: diagnosticsData,
    isLoading: isLoadingDiagnostics,
  } = useGetVehicleDiagnostics(vehicleId);

  // Fetch sensor data filtered by the selected diagnostic session
  const {
    data: sensorData,
    isLoading: isLoadingSensorData,
  } = useGetVehicleSensorData(vehicleId, {
    diagnosticId: selectedDiagnosticId || undefined,
  });

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

  // Handle diagnostic session change - update URL
  const handleDiagnosticSessionChange = (sessionId: string) => {
    setSelectedDiagnosticId(sessionId);
  };

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-4 p-4 lg:p-6">
      {!selectedDiagnosticId && !isLoadingDiagnostics && (
        <Alert>
          <LineChart className="h-4 w-4" />
          <AlertTitle>No diagnostic session selected</AlertTitle>
          <AlertDescription>
            Please select a diagnostic session to view sensor charts
          </AlertDescription>
        </Alert>
      )}

      {selectedDiagnosticId && (
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <TabsList className="h-9">
              <TabsTrigger value="overview">
                <ChartBar className="mr-1 h-3 w-3" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="comparison">
                <PlayIcon className="mr-1 h-3 w-3" />
                Comparison
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-wrap items-center gap-2">
              <DiagnosticSessionSelector
                sessions={diagnosticsData || []}
                selectedSession={selectedDiagnosticId || null}
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
                <Link to="/app/$vehicleId/tables" params={{ vehicleId }}>
                  <Button variant="outline" size="sm">
                    <Grid3X3 className="mr-2 h-4 w-4" />
                    Tables View
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-4">
            <SensorChartOverview data={sensorData} isLoading={isLoadingSensorData} />
          </TabsContent>

          <TabsContent value="comparison">
            <SensorChartComparison isLoading={isLoadingSensorData} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
