import type { ColumnOrderState } from "@tanstack/react-table";
import type React from "react";

import { toast } from "sonner";

export type TableDragHandlers = {
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => void;
};

export function useTableDragHandlers(
  columnOrder: ColumnOrderState,
  setColumnOrder: React.Dispatch<React.SetStateAction<ColumnOrderState>>,
): TableDragHandlers {
  // Define a function to handle column drag start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
    e.dataTransfer.setData("columnId", columnId);
    e.dataTransfer.effectAllowed = "move";

    // Add class to the element being dragged for visual feedback
    const element = e.currentTarget as HTMLDivElement;
    setTimeout(() => {
      element.classList.add("opacity-50", "bg-accent");
    }, 0);
  };

  // Define a function to handle column drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    // Visual indication of where column will be dropped
    e.currentTarget.classList.add("border-l-2", "border-r-2", "border-primary");
  };

  // Define a function to handle column drag leave
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("border-l-2", "border-r-2", "border-primary");
  };

  // Define a function to handle column drag end
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("opacity-50", "bg-accent");

    // Remove all drag-over effects from all headers
    document.querySelectorAll(".border-l-2.border-r-2.border-primary").forEach((el) => {
      el.classList.remove("border-l-2", "border-r-2", "border-primary");
    });
  };

  // Define a function to handle column drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-l-2", "border-r-2", "border-primary");

    const sourceColumnId = e.dataTransfer.getData("columnId");

    if (sourceColumnId === targetColumnId)
      return;

    // Get current column order
    const newColumnOrder = [...columnOrder];

    // Find source and target column indices
    const sourceIndex = newColumnOrder.findIndex(id => id === sourceColumnId);
    const targetIndex = newColumnOrder.findIndex(id => id === targetColumnId);

    if (sourceIndex !== -1 && targetIndex !== -1) {
      // Remove source from its position
      newColumnOrder.splice(sourceIndex, 1);

      // Insert source column at target position
      newColumnOrder.splice(targetIndex, 0, sourceColumnId);

      // Update column order
      setColumnOrder(newColumnOrder);

      // Show success toast
      toast.success("Column order updated");
    }
  };

  return {
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDragEnd,
    handleDrop,
  };
}
