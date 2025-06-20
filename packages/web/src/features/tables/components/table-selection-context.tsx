import React, { createContext, useCallback, useContext, useState } from "react";

import type { SensorData } from "../types";

import { TableSelectionActionBar } from "./table-selection-action-bar";

// Define the context types
type TableSelectionContextType = {
  selectedRows: Record<string, SensorData[]>;
  addSelectedRows: (tableId: string, rows: SensorData[]) => void;
  clearSelectedRows: (tableId?: string) => void;
  totalSelectedCount: number;
  clearAllFlag: number; // A counter that increments when clear all is pressed
};

// Create the context
const TableSelectionContext = createContext<TableSelectionContextType | undefined>(undefined);

// Create the provider component
export function TableSelectionProvider({ children }: { children: React.ReactNode }) {
  // Store selections as a record of tableId -> selected rows
  const [selectedRows, setSelectedRows] = useState<Record<string, SensorData[]>>({});
  // Counter that changes when clear all is pressed - tables watch this value
  const [clearAllFlag, setClearAllFlag] = useState(0);

  // Calculate total number of selected rows across all tables
  const totalSelectedCount = Object.values(selectedRows).reduce(
    (count, rows) => count + rows.length,
    0,
  );

  // Add or update selected rows for a specific table
  const addSelectedRows = useCallback((tableId: string, rows: SensorData[]) => {
    setSelectedRows(prev => ({
      ...prev,
      [tableId]: rows,
    }));
  }, []);

  // Clear selections for a specific table or all tables
  const clearSelectedRows = useCallback((tableId?: string) => {
    if (tableId) {
      // Clear specific table
      setSelectedRows((prev) => {
        const newState = { ...prev };
        delete newState[tableId];
        return newState;
      });
    }
    else {
      // Clear all tables and increment the flag to notify tables
      setSelectedRows({});
      setClearAllFlag(prev => prev + 1);
    }
  }, []);

  // Get all selected rows as a flat array for the action bar
  const allSelectedRows = Object.values(selectedRows).flat();

  return (
    <TableSelectionContext.Provider value={{
      selectedRows,
      addSelectedRows,
      clearSelectedRows,
      totalSelectedCount,
      clearAllFlag,
    }}
    >
      {children}

      {/* Use the extracted action bar component */}
      <TableSelectionActionBar
        selectedRows={allSelectedRows}
        clearSelectedRows={() => clearSelectedRows()}
      />
    </TableSelectionContext.Provider>
  );
}

// Custom hook to use the table selection context
export function useTableSelection() {
  const context = useContext(TableSelectionContext);
  if (context === undefined) {
    throw new Error("useTableSelection must be used within a TableSelectionProvider");
  }
  return context;
}
