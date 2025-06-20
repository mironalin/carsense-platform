import { Copy } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FullScreenChartDialog } from "@/features/charts/components/full-screen-chart-dialog";
import { SensorChartCard } from "@/features/charts/components/sensor-chart-card";
import { useChartFavorites } from "@/features/charts/overview/hooks/use-chart-favorites";
import { useChartPreferences } from "@/features/charts/overview/hooks/use-chart-preferences";
import { colorThemes } from "@/features/charts/utils/color-themes";

import type { ColorTheme, Sensor, SensorChartOverviewProps } from "../../types";

import { generateSensorChartData } from "../utils/generate-chart-data";
import { ChartFilters } from "./chart-filters";
import { NoDataAvailable } from "./no-data-available";
import { SensorChartOverviewSkeleton } from "./sensor-skeleton";

export function SensorChartOverview({ data, isLoading }: SensorChartOverviewProps) {
  // State for filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);

  // Get chart preferences from localStorage
  const { chartType, setChartType, colorTheme, setColorTheme } = useChartPreferences();

  // State to track which charts are visible
  const [visibleCharts, setVisibleCharts] = useState<Record<string, boolean>>({});

  // Chart favorites hook
  const { toggleFavorite, isFavorite } = useChartFavorites();

  // State for full-screen chart dialog
  const [fullScreenChart, setFullScreenChart] = useState<{
    isOpen: boolean;
    sensor: Sensor | null;
    chartData: any[];
  }>({
    isOpen: false,
    sensor: null,
    chartData: [],
  });

  // Get the current selected diagnostic ID
  const selectedDiagnosticId = data?.diagnostics[0].uuid;

  // Filter sensors based on active filters
  const filteredSensors = useMemo(() => {
    if (!data?.sensors || data.sensors.length === 0) {
      return [];
    }

    return data.sensors.filter((sensor: Sensor) => {
      // Filter by categories
      const categoryMatch = selectedCategories.length === 0
        || selectedCategories.includes(sensor.category);

      // Filter by search term
      const searchMatch = !searchTerm
        || sensor.name.toLowerCase().includes(searchTerm.toLowerCase())
        || sensor.pid.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by favorites
      const favoriteMatch = !showFavoritesOnly || isFavorite(sensor.pid);

      return categoryMatch && searchMatch && favoriteMatch;
    });
  }, [data, selectedCategories, searchTerm, showFavoritesOnly, isFavorite]);

  // Preprocess all chart data at once to avoid useMemo in the mapping function
  // Regenerate when diagnostic changes
  const allChartData = useMemo(() => {
    if (!data?.sensors) {
      return {};
    }

    const result: Record<string, any[]> = {};
    data.sensors.forEach((sensor: any) => {
      // Generate and create a fresh copy of the data
      const chartData = generateSensorChartData(sensor);
      result[sensor.pid] = [...chartData];
    });
    return result;
  }, [data?.sensors, selectedDiagnosticId]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSelectedCategories([]);
    setSearchTerm("");
    setShowFavoritesOnly(false);
  }, []);

  // Setup intersection observer to detect which charts are visible
  useEffect(() => {
    // Skip if IntersectionObserver is not available
    if (typeof IntersectionObserver === "undefined")
      return;

    // Create a new observer instance
    const observer = new IntersectionObserver(
      (entries) => {
        // Update visibility state based on intersection changes
        setVisibleCharts((prev) => {
          const updated = { ...prev };

          entries.forEach((entry) => {
            const id = entry.target.getAttribute("data-sensor-id");
            if (id) {
              updated[id] = entry.isIntersecting;
            }
          });

          return updated;
        });
      },
      {
        root: null, // Use viewport as root
        rootMargin: "100px 0px", // Load charts 100px before they come into view
        threshold: 0.5, // Trigger when 50% of the element is visible
      },
    );

    // Observe all chart containers
    const chartContainers = document.querySelectorAll("[data-sensor-id]");
    chartContainers.forEach((container) => {
      observer.observe(container);
    });

    // Cleanup function to disconnect observer
    return () => {
      observer.disconnect();
    };
  }, [filteredSensors.length, chartType]); // Re-run when filters or chart type changes

  // Open chart in full-screen dialog
  const openFullScreenChart = (sensor: Sensor, chartData: any[]) => {
    setFullScreenChart({
      isOpen: true,
      sensor,
      chartData,
    });
  };

  // Close full-screen chart dialog
  const closeFullScreenChart = () => {
    setFullScreenChart(prev => ({
      ...prev,
      isOpen: false,
    }));
  };

  // Handle click on chart data point
  const handleChartClick = (sensor: Sensor, data: any) => {
    if (!data || !data.activePayload || data.activePayload.length === 0)
      return;

    const point = data.activePayload[0].payload;
    const value = point.value;
    const timestamp = new Date(point.timestamp).toLocaleString();
    const sensorUnit = sensor.unit || "";

    // Copy to clipboard with sensor name included
    navigator.clipboard.writeText(`${sensor.name}: ${value} ${sensorUnit} at ${timestamp}`).then(() => {
      toast.success("Value copied to clipboard", {
        description: `${sensor.name}: ${value} ${sensorUnit} at ${timestamp}`,
        duration: 2000,
      });
    }).catch((err) => {
      console.error("Could not copy value: ", err);
      toast.error("Failed to copy to clipboard");
    });
  };

  if (isLoading) {
    return <SensorChartOverviewSkeleton />;
  }

  // If no data available
  if (!data?.sensors || data.sensors.length === 0) {
    return <NoDataAvailable />;
  }

  // Categories from the data
  const categories = data.categories;

  // Get current color theme
  const categoryColors = colorThemes[colorTheme as ColorTheme].colors;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <ChartFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        resetFilters={resetFilters}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        categories={categories}
        allSensors={data.sensors}
        chartType={chartType}
        setChartType={setChartType}
        colorTheme={colorTheme}
        setColorTheme={setColorTheme}
      />

      {/* Hint about click-to-copy functionality */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Copy className="h-3.5 w-3.5" />
        <span>Click on any data point to copy its value</span>
      </div>

      {/* Full-screen chart dialog */}
      <FullScreenChartDialog
        isOpen={fullScreenChart.isOpen}
        onClose={closeFullScreenChart}
        sensor={fullScreenChart.sensor}
        chartData={fullScreenChart.chartData}
        chartType={chartType}
        categoryColor={fullScreenChart.sensor
          ? (categoryColors[fullScreenChart.sensor.category as keyof typeof categoryColors] || categoryColors.Other)
          : categoryColors.Other}
      />

      {/* No results message */}
      {filteredSensors.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No matching charts</CardTitle>
            <CardDescription>
              No charts match the current filters. Try adjusting your filters or search term.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={resetFilters} variant="outline">Reset Filters</Button>
          </CardContent>
        </Card>
      )}

      {/* Charts grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredSensors.map((sensor: Sensor, index: number) => {
          // Get the pre-generated chart data for this sensor
          const chartData = allChartData[sensor.pid] || [];
          const isSensorFavorite = isFavorite(sensor.pid);

          // Get color for this category or default
          const categoryColor = categoryColors[sensor.category as keyof typeof categoryColors] || categoryColors.Other;

          // Check if this chart is visible or if we haven't tracked any charts yet
          const isVisible = visibleCharts[sensor.pid] || Object.keys(visibleCharts).length === 0;

          return (
            <SensorChartCard
              key={sensor.pid}
              sensor={sensor}
              chartData={chartData}
              categoryColor={categoryColor}
              chartType={chartType}
              index={index}
              isFavorite={isSensorFavorite}
              isVisible={isVisible}
              onFavoriteToggle={() => toggleFavorite(sensor.pid)}
              onFullScreen={() => openFullScreenChart(sensor, chartData)}
              onChartClick={data => handleChartClick(sensor, data)}
            />
          );
        })}
      </div>
    </div>
  );
}
