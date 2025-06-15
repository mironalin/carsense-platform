import { useCallback, useEffect, useState } from "react";

import type { ComparisonPreferences } from "@/features/charts/types";

/**
 * Hook to manage comparison preferences in localStorage
 */
export function useComparisonPreferences(): ComparisonPreferences {
  // State for selected sensor IDs
  const [selectedSensorIds, setSelectedSensorIds] = useState<string[]>([]);

  // State for selected diagnostic session IDs
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([]);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const storedSensors = localStorage.getItem("comparison-selected-sensors");
      if (storedSensors) {
        setSelectedSensorIds(JSON.parse(storedSensors));
      }

      const storedSessions = localStorage.getItem("comparison-selected-sessions");
      if (storedSessions) {
        setSelectedSessionIds(JSON.parse(storedSessions));
      }
    }
    catch (error) {
      console.error("Error loading comparison preferences:", error);
    }
  }, []);

  // Update selected sensors
  const updateSelectedSensors = useCallback((sensorIds: string[]) => {
    setSelectedSensorIds(sensorIds);
    try {
      localStorage.setItem("comparison-selected-sensors", JSON.stringify(sensorIds));
    }
    catch (error) {
      console.error("Error saving selected sensors:", error);
    }
  }, []);

  // Update selected diagnostic sessions
  const updateSelectedSessions = useCallback((sessionIds: string[]) => {
    setSelectedSessionIds(sessionIds);
    try {
      localStorage.setItem("comparison-selected-sessions", JSON.stringify(sessionIds));
    }
    catch (error) {
      console.error("Error saving selected sessions:", error);
    }
  }, []);

  return {
    selectedSensorIds,
    updateSelectedSensors,
    selectedSessionIds,
    updateSelectedSessions,
  };
}
