import React, { createContext, useContext, useEffect, useRef, useState } from "react";

import type { DiagnosticDTCWithInfo } from "../types";

import { useGetDTCByCode } from "../api/use-get-dtc-by-code";

// Define the context type
type DTCSeverityContextType = {
  updateDTCSeverity: (dtcId: string, severity: "high" | "medium" | "low") => void;
  getDTCSeverity: (dtcId: string) => "high" | "medium" | "low" | undefined;
  severityMap: Map<string, "high" | "medium" | "low">;
};

// Create the context with a default value
const DTCSeverityContext = createContext<DTCSeverityContextType>({
  updateDTCSeverity: () => {},
  getDTCSeverity: () => undefined,
  severityMap: new Map(),
});

// Hook for using the context
export const useDTCSeverity = () => useContext(DTCSeverityContext);

// Provider component
export const DTCSeverityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Map to store DTC severities by ID
  const [severityMap, setSeverityMap] = useState<Map<string, "high" | "medium" | "low">>(
    new Map(),
  );

  // Function to update a DTC's severity
  const updateDTCSeverity = (dtcId: string, severity: "high" | "medium" | "low") => {
    setSeverityMap((prev) => {
      const newMap = new Map(prev);
      newMap.set(dtcId, severity);
      return newMap;
    });
  };

  // Function to get a DTC's severity
  const getDTCSeverity = (dtcId: string) => {
    return severityMap.get(dtcId);
  };

  return (
    <DTCSeverityContext.Provider value={{ updateDTCSeverity, getDTCSeverity, severityMap }}>
      {children}
    </DTCSeverityContext.Provider>
  );
};

// Component to fetch and update DTC severity
export const DTCSeverityUpdater: React.FC<{ dtc: DiagnosticDTCWithInfo }> = ({ dtc }) => {
  const { updateDTCSeverity } = useDTCSeverity();
  const { data: dtcInfo } = useGetDTCByCode(dtc.code);
  const hasUpdatedRef = useRef(false);

  useEffect(() => {
    // Skip if we've already updated this DTC's severity
    if (hasUpdatedRef.current)
      return;

    if (dtcInfo?.severity) {
      updateDTCSeverity(dtc.uuid, dtcInfo.severity);
      hasUpdatedRef.current = true;
    }
    else if (dtc.severity) {
      updateDTCSeverity(dtc.uuid, dtc.severity);
      hasUpdatedRef.current = true;
    }
  }, [dtc, dtcInfo, updateDTCSeverity]);

  return null; // This component doesn't render anything
};
