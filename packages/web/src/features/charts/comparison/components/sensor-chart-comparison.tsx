import { useParams } from "@tanstack/react-router";
import { parseAsString, useQueryState } from "nuqs";
import { useMemo, useState } from "react";

import type { ChartType, Sensor, SensorData } from "@/features/charts/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartControls } from "@/features/charts/components/chart-controls";
import { FullScreenChartDialog } from "@/features/charts/components/full-screen-chart-dialog";
import { useChartPreferences } from "@/features/charts/overview/hooks/use-chart-preferences";
import { colorThemes } from "@/features/charts/utils/color-themes";
import { useGetVehicleSensorData } from "@/features/sensors/api/use-get-vehicle-sensor-data";
import { SensorSelector } from "@/features/sensors/playback/components/sensor-selector";
import { useGetVehicleDiagnostics } from "@/features/vehicles/api/use-get-vehicle-diagnostics";

import { useComparisonPreferences } from "../hooks/use-comparison-preferences";
import { useSelectionSync } from "../hooks/use-selection-sync";
import { generateComparisonChartData } from "../utils/generate-comparison-data";
import { sessionColorPalettes } from "../utils/session-color-palettes";
import { ComparisonChartCard } from "./comparison-chart-card";
import { ComparisonEmptyState } from "./comparison-empty-state";
import { ComparisonLoadingState } from "./comparison-loading-state";
import { SessionSelectionContainer } from "./session-selection-container";

export function SensorChartComparison({ isLoading: initialLoading }: { isLoading: boolean }) {
  const { vehicleId } = useParams({ from: "/_authenticated/app/$vehicleId/charts/" });

  // Get chart preferences from localStorage (consistent with overview tab)
  const { chartType, setChartType, colorTheme, setColorTheme } = useChartPreferences();

  // Get comparison preferences from localStorage
  const {
    selectedSensorIds,
    updateSelectedSensors,
    selectedSessionIds,
    updateSelectedSessions,
  } = useComparisonPreferences();

  const [isSelectorMinimized, setIsSelectorMinimized] = useState(() => {
    // Check if we have a saved preference in local storage
    const savedPreference = localStorage.getItem("sensorSelectorMinimized");
    return savedPreference === "true";
  });

  const handleToggleMinimize = () => {
    setIsSelectorMinimized(prev => !prev);
  };

  // State for full-screen chart dialog
  const [fullScreenChart, setFullScreenChart] = useState<{
    isOpen: boolean;
    sensor: Sensor | null;
    chartData: any[];
    categoryColor: string;
  }>({
    isOpen: false,
    sensor: null,
    chartData: [],
    categoryColor: "",
  });

  // Store selected diagnostic sessions in URL query parameter
  const [comparisonDiagnosticIds, setComparisonDiagnosticIds] = useQueryState(
    "comparisonDiagnosticIds",
    parseAsString.withDefault(""),
  );

  // Store selected sensors in URL query parameter
  const [comparisonSensorIds, setComparisonSensorIds] = useQueryState(
    "comparisonSensorIds",
    parseAsString.withDefault(""),
  );

  // Convert comma-separated string to array
  const selectedSessions = comparisonDiagnosticIds ? comparisonDiagnosticIds.split(",") : [];
  const selectedSensors = comparisonSensorIds ? comparisonSensorIds.split(",") : [];

  // Sync URL query parameters with localStorage preferences
  useSelectionSync({
    urlSessions: selectedSessions,
    urlSensors: selectedSensors,
    localStorageSessions: selectedSessionIds,
    localStorageSensors: selectedSensorIds,
    setUrlSessions: setComparisonDiagnosticIds,
    setUrlSensors: setComparisonSensorIds,
    updateLocalStorageSessions: updateSelectedSessions,
    updateLocalStorageSensors: updateSelectedSensors,
  });

  // Fetch all diagnostic sessions for this vehicle
  const {
    data: diagnosticsData,
    isLoading: isLoadingDiagnostics,
  } = useGetVehicleDiagnostics(vehicleId);

  // Extract session IDs for fetching data
  const firstSessionId = selectedSessions[0] || null;
  const secondSessionId = selectedSessions[1] || null;
  const thirdSessionId = selectedSessions[2] || null;

  // Fetch data for each selected session
  const {
    data: firstSessionData,
    isLoading: isLoadingFirstSession,
  } = useGetVehicleSensorData(vehicleId, {
    diagnosticId: firstSessionId || undefined,
  });

  const {
    data: secondSessionData,
    isLoading: isLoadingSecondSession,
  } = useGetVehicleSensorData(vehicleId, {
    diagnosticId: secondSessionId || undefined,
  });

  const {
    data: thirdSessionData,
    isLoading: isLoadingThirdSession,
  } = useGetVehicleSensorData(vehicleId, {
    diagnosticId: thirdSessionId || undefined,
  });

  // Combine all session data into a single object
  const sessionDataMap = useMemo(() => {
    const result: Record<string, SensorData | undefined> = {};

    if (firstSessionId && firstSessionData) {
      result[firstSessionId] = firstSessionData;
    }

    if (secondSessionId && secondSessionData) {
      result[secondSessionId] = secondSessionData;
    }

    if (thirdSessionId && thirdSessionData) {
      result[thirdSessionId] = thirdSessionData;
    }

    return result;
  }, [firstSessionId, firstSessionData, secondSessionId, secondSessionData, thirdSessionId, thirdSessionData]);

  // Create session labels for the charts
  const sessionLabels = useMemo(() => {
    const result: Record<string, string> = {};

    if (!diagnosticsData)
      return result;

    selectedSessions.forEach((sessionId: string, index: number) => {
      const session = diagnosticsData.find(d => d.uuid === sessionId);
      if (session) {
        const date = new Date(session.createdAt);
        result[sessionId] = `${date.toLocaleDateString()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
      }
      else {
        result[sessionId] = `Session ${index + 1}`;
      }
    });

    return result;
  }, [diagnosticsData, selectedSessions]);

  // Get all available sensors from the first session with data
  const availableSensors = useMemo(() => {
    for (const sessionId in sessionDataMap) {
      const data = sessionDataMap[sessionId];
      if (data && data.sensors && data.sensors.length > 0) {
        return data.sensors;
      }
    }
    return [];
  }, [sessionDataMap]);

  // Get category colors from the first session with data
  const categoryColors = useMemo(() => {
    // Use the selected color theme from preferences
    const themeColors = colorThemes[colorTheme as keyof typeof colorThemes]?.colors || colorThemes.default.colors;

    const colors: Record<string, string> = {
      Engine: themeColors.Engine || "#3b82f6", // blue-500
      Temperature: themeColors.Temperature || "#ef4444", // red-500
      Electrical: themeColors.Electrical || "#8b5cf6", // violet-500
      Fluid: themeColors.Fluid || "#10b981", // emerald-500
      Emissions: themeColors.Emissions || "#f59e0b", // amber-500
      Other: themeColors.Other || "#6b7280", // gray-500
    };

    return colors;
  }, [colorTheme]);

  // Generate session colors based on the current theme
  const sessionColors = useMemo(() => {
    // Get the appropriate color palette for the current theme
    return sessionColorPalettes[colorTheme as keyof typeof sessionColorPalettes] || sessionColorPalettes.default;
  }, [colorTheme]);

  // Overall loading state
  const isLoading = initialLoading
    || isLoadingDiagnostics
    || (!!firstSessionId && isLoadingFirstSession)
    || (!!secondSessionId && isLoadingSecondSession)
    || (!!thirdSessionId && isLoadingThirdSession);

  // Handle session selection changes
  const handleSessionsChange = (sessions: string[]) => {
    setComparisonDiagnosticIds(sessions.join(","));
    updateSelectedSessions(sessions);
  };

  // Handle removing a specific session
  const handleRemoveSession = (sessionId: string) => {
    const newSessions = selectedSessions.filter((id: string) => id !== sessionId);
    setComparisonDiagnosticIds(newSessions.join(","));
    updateSelectedSessions(newSessions);
  };

  // Handle sensor selection changes
  const handleSensorChange = (sensors: string[]) => {
    setComparisonSensorIds(sensors.join(","));
    updateSelectedSensors(sensors);
  };

  // Handle removing a specific sensor
  const handleRemoveSensor = (sensorId: string) => {
    const newSensors = selectedSensors.filter((id: string) => id !== sensorId);
    setComparisonSensorIds(newSensors.join(","));
    updateSelectedSensors(newSensors);
  };

  // Toggle a single sensor
  const handleToggleSensor = (sensorId: string) => {
    if (selectedSensors.includes(sensorId)) {
      // Remove sensor if already selected
      handleRemoveSensor(sensorId);
    }
    else {
      // Add sensor if not already selected
      handleSensorChange([...selectedSensors, sensorId]);
    }
  };

  // Select all sensors
  const handleSelectAllSensors = () => {
    const allSensorIds = availableSensors.map(sensor => sensor.pid);
    handleSensorChange(allSensorIds);
  };

  // Clear all selected sensors
  const handleClearAllSensors = () => {
    handleSensorChange([]);
  };

  // Open chart in full-screen dialog
  const openFullScreenChart = (sensor: Sensor, chartData: any[], categoryColor: string) => {
    setFullScreenChart({
      isOpen: true,
      sensor,
      chartData,
      categoryColor,
    });
  };

  // Close full-screen chart dialog
  const closeFullScreenChart = () => {
    setFullScreenChart(prev => ({
      ...prev,
      isOpen: false,
    }));
  };

  if (isLoading) {
    return <ComparisonLoadingState />;
  }

  return (
    <div className="space-y-6">
      {/* Session selector */}
      <SessionSelectionContainer
        sessions={diagnosticsData || []}
        selectedSessions={selectedSessions}
        onSessionsChange={handleSessionsChange}
        onRemoveSession={handleRemoveSession}
        isLoading={isLoadingDiagnostics}
        sessionColors={sessionColors}
      />

      {/* Sensor selector */}
      {selectedSessions.length > 0 && (
        <SensorSelector
          sensors={availableSensors}
          selectedSensors={selectedSensors}
          onToggleSensor={handleToggleSensor}
          onSelectAll={handleSelectAllSensors}
          onClearAll={handleClearAllSensors}
          isMinimized={isSelectorMinimized}
          onToggleMinimize={handleToggleMinimize}
        />
      )}

      {/* Chart controls and charts */}
      {selectedSessions.length > 0 && selectedSensors.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Selected Sensors:
                {" "}
                {selectedSensors.length}
              </CardTitle>

              {/* Chart controls - type and theme selectors */}
              <ChartControls
                chartType={chartType}
                onChartTypeChange={value => setChartType(value as ChartType)}
                colorTheme={colorTheme}
                onColorThemeChange={value => setColorTheme(value)}
              />
            </div>
          </CardHeader>

          {/* Display comparison charts */}
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {selectedSensors.map((sensorId: string, index: number) => {
                // Generate comparison data for this sensor
                const { normalizedData, sensorInfo } = generateComparisonChartData(
                  sensorId,
                  sessionDataMap,
                  sessionLabels,
                  sessionColors,
                );

                if (!sensorInfo)
                  return null;

                // Create chart config for multi-series
                const chartConfig: Record<string, { label: string; color: string }> = {};
                selectedSessions.forEach((sessionId: string, idx: number) => {
                  chartConfig[sessionId] = {
                    label: sessionLabels[sessionId] || `Session ${idx + 1}`,
                    color: sessionColors[idx % sessionColors.length],
                  };
                });

                // Create modified sensor with multi-series properties
                const modifiedSensor = {
                  ...sensorInfo,
                  isMultiSeries: true,
                  seriesConfig: chartConfig,
                };

                // Get category color from theme
                const categoryColor = categoryColors[sensorInfo.category] || categoryColors.Other;

                return (
                  <ComparisonChartCard
                    key={sensorId}
                    sensor={modifiedSensor}
                    chartData={normalizedData}
                    chartType={chartType as ChartType}
                    categoryColor={categoryColor}
                    index={index}
                    onFullScreen={() => openFullScreenChart(modifiedSensor, normalizedData, categoryColor)}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty state when no sessions selected */}
      {selectedSessions.length === 0 && <ComparisonEmptyState />}

      {/* Full-screen chart dialog */}
      <FullScreenChartDialog
        isOpen={fullScreenChart.isOpen}
        onClose={closeFullScreenChart}
        sensor={fullScreenChart.sensor}
        chartData={fullScreenChart.chartData}
        chartType={chartType as ChartType}
        categoryColor={fullScreenChart.categoryColor}
      />
    </div>
  );
}
