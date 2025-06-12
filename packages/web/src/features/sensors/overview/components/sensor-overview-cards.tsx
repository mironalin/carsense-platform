import { Badge } from "@/components/ui/badge";

import type { SensorCardData, SensorOverviewCardsProps } from "../types";

import { useSensorData } from "../hooks/use-sensor-data";
import { useSensorFavorites } from "../hooks/use-sensor-favorites";
import { useSensorFilters } from "../hooks/use-sensor-filters";
import { calculateTrend } from "../utils";
import { SensorCard } from "./sensor-card";
import { SensorFilters } from "./sensor-filters";
import { SnapshotNavigation } from "./snapshot-navigation";
import "../styles.css";

export function SensorOverviewCards(props: SensorOverviewCardsProps) {
  // Use our custom hooks to manage the component state
  const { isLoading, sensorData, snapshots, currentSnapshotIndex, setCurrentSnapshotIndex } = useSensorData(props);
  const { favorites, toggleFavorite, isFavorite } = useSensorFavorites();
  const {
    searchTerm,
    setSearchTerm,
    selectedCategories,
    setSelectedCategories,
    showFavoritesOnly,
    setShowFavoritesOnly,
    uniqueCategories,
    filteredSensors,
    resetFilters,
  } = useSensorFilters(sensorData, favorites);

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <SensorFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        uniqueCategories={uniqueCategories}
        allSensorData={sensorData}
        resetFilters={resetFilters}
      />

      {/* Snapshot Navigation */}
      {snapshots && snapshots.length > 0 && (
        <SnapshotNavigation
          snapshots={snapshots}
          currentSnapshotIndex={currentSnapshotIndex}
          onSnapshotChange={setCurrentSnapshotIndex}
        />
      )}

      {/* Show how many sensors are displayed */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Sensor Readings
          <Badge variant="outline" className="ml-2">
            {filteredSensors.length}
            {" "}
            of
            {" "}
            {sensorData.length}
          </Badge>
        </h2>

        {filteredSensors.length === 0 && !isLoading && (
          <div className="text-muted-foreground text-sm">
            No sensors match your filters. Try adjusting your search or filters.
          </div>
        )}
      </div>

      {/* Sensors Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredSensors.map((item: SensorCardData) => {
          // Handle the case where lastValue is 0 (which is falsy but a valid value)
          const sensorValue = item.sensor?.lastValue !== undefined && item.sensor?.lastValue !== null
            ? item.sensor.lastValue
            : null;

          return (
            <SensorCard
              key={item.sensor.pid || item.title}
              title={item.title}
              value={sensorValue}
              unit={item.sensor?.unit || item.unit}
              categoryIcon={item.categoryIcon}
              category={item.category}
              isLoading={isLoading}
              trend={item.sensor?.readings ? calculateTrend(item.sensor.readings) : undefined}
              minValue={item.sensor?.minValue || null}
              maxValue={item.sensor?.maxValue || null}
              timestamp={item.sensor?.readings?.[0]?.timestamp}
              readings={item.sensor?.readings}
              snapshotReadings={item.sensor?.snapshotReadings}
              delayAnimation={item.delay}
              isFavorite={isFavorite(item.sensor.pid || "")}
              onToggleFavorite={() => toggleFavorite(item.sensor.pid || "")}
            />
          );
        })}
      </div>
    </div>
  );
}
