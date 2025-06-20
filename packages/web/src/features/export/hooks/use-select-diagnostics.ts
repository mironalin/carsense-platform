import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import type { DiagnosticItem } from "../types";

import { useGetDiagnostics } from "../api/use-get-diagnostics";
import { useExport } from "../components/export-context";
import { ExportStepId } from "../types";

export function useSelectDiagnostics() {
  const { vehicleId } = useParams({ from: "/_authenticated/app/$vehicleId/export/" });
  const { data: diagnostics, isLoading, error } = useGetDiagnostics(vehicleId);
  const { setSelectedDiagnostics, setCurrentStep, selection } = useExport();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<DiagnosticItem[]>(selection.diagnostics || []);

  // Reset selected items when vehicle ID changes
  useEffect(() => {
    setSelectedItems([]);
    setSearchTerm("");
  }, [vehicleId]);

  // Filter diagnostics based on search term
  const filteredDiagnostics = diagnostics
    ? diagnostics.filter(diag =>
        diag.name.toLowerCase().includes(searchTerm.toLowerCase())
        || diag.category.toLowerCase().includes(searchTerm.toLowerCase())
        || (diag.date && diag.date.toLowerCase().includes(searchTerm.toLowerCase()))
        || (diag.odometer && diag.odometer.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    : [];

  // Group diagnostics by category (which now represents the vehicle)
  const diagnosticsByCategory: Record<string, DiagnosticItem[]> = {};
  filteredDiagnostics.forEach((diag) => {
    const category = diag.category || "Unknown Vehicle";
    if (!diagnosticsByCategory[category]) {
      diagnosticsByCategory[category] = [];
    }
    diagnosticsByCategory[category].push(diag);
  });

  const handleSelectAll = () => {
    if (selectedItems.length === filteredDiagnostics.length) {
      setSelectedItems([]);
    }
    else {
      setSelectedItems([...filteredDiagnostics]);
    }
  };

  const handleClearAll = () => {
    setSelectedItems([]);
  };

  const handleItemToggle = (item: DiagnosticItem) => {
    setSelectedItems((prev) => {
      const exists = prev.some(i => i.id === item.id);
      if (exists) {
        return prev.filter(i => i.id !== item.id);
      }
      else {
        return [...prev, item];
      }
    });
  };

  const isItemSelected = (itemId: string) => {
    return selectedItems.some(item => item.id === itemId);
  };

  const handleNext = () => {
    setSelectedDiagnostics(selectedItems);
    setCurrentStep(ExportStepId.ConfigureExport);
  };

  return {
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedItems,
    filteredDiagnostics,
    diagnosticsByCategory,
    handleSelectAll,
    handleClearAll,
    handleItemToggle,
    isItemSelected,
    handleNext,
  };
}
