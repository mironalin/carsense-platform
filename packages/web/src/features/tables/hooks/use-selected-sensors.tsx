import { useEffect, useState } from "react";

// Storage key for selected sensors
const STORAGE_KEY_SELECTED_SENSORS = "carsense-tables-selected-sensors";

type UseSelectedSensorsReturn = {
  selectedSensors: string[];
  setSelectedSensors: React.Dispatch<React.SetStateAction<string[]>>;
  handleToggleSensor: (pid: string) => void;
  handleSelectAll: (allPids: string[]) => void;
  handleClearAll: () => void;
  isSelectorMinimized: boolean;
  handleToggleMinimize: () => void;
};

export function useSelectedSensors(): UseSelectedSensorsReturn {
  // Selected sensors state
  const [selectedSensors, setSelectedSensors] = useState<string[]>(() => {
    // Try to load selected sensors from localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SELECTED_SENSORS);
      return saved ? JSON.parse(saved) : [];
    }
    catch (error) {
      console.error("Error loading selected sensors from localStorage:", error);
      return [];
    }
  });

  // Selector minimized state
  const [isSelectorMinimized, setIsSelectorMinimized] = useState(() => {
    // Check if we have a saved preference in local storage
    const savedPreference = localStorage.getItem("sensorSelectorMinimized");
    return savedPreference === "true";
  });

  // Save selected sensors to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SELECTED_SENSORS, JSON.stringify(selectedSensors));
    }
    catch (error) {
      console.error("Error saving selected sensors to localStorage:", error);
    }
  }, [selectedSensors]);

  // Toggle a sensor selection
  const handleToggleSensor = (pid: string) => {
    setSelectedSensors(prev =>
      prev.includes(pid)
        ? prev.filter(id => id !== pid)
        : [...prev, pid],
    );
  };

  // Select all sensors
  const handleSelectAll = (allPids: string[]) => {
    setSelectedSensors(allPids);
  };

  // Clear all sensor selections
  const handleClearAll = () => {
    setSelectedSensors([]);
  };

  // Toggle minimized state and save preference
  const handleToggleMinimize = () => {
    setIsSelectorMinimized((prev) => {
      const newState = !prev;
      localStorage.setItem("sensorSelectorMinimized", String(newState));
      return newState;
    });
  };

  return {
    selectedSensors,
    setSelectedSensors,
    handleToggleSensor,
    handleSelectAll,
    handleClearAll,
    isSelectorMinimized,
    handleToggleMinimize,
  };
}
