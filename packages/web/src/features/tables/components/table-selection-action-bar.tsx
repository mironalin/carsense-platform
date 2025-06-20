import { ClipboardCopy, Download, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import type { SensorData } from "../types";

import { convertSensorDataToCsv, downloadCsv } from "../utils/export-utils";

type TableSelectionActionBarProps = {
  selectedRows: SensorData[];
  clearSelectedRows: () => void;
};

export function TableSelectionActionBar({ selectedRows, clearSelectedRows }: TableSelectionActionBarProps) {
  const totalSelectedCount = selectedRows.length;

  if (totalSelectedCount === 0) {
    return null;
  }

  // Handler for exporting all selected rows
  const handleExportSelected = () => {
    const csvData = convertSensorDataToCsv(selectedRows);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").substring(0, 19);
    const filename = `sensor-data-export-${timestamp}.csv`;
    downloadCsv(csvData, filename);
    toast.success(`Exported data for ${totalSelectedCount} ${totalSelectedCount === 1 ? "sensor" : "sensors"}`);
  };

  // Handler for copying selected rows to clipboard
  const handleCopySelected = () => {
    // Create a formatted text representation of the data
    const headerRow = ["Name", "Value", "Unit", "Category", "Timestamp"].join("\t");
    const dataRows = selectedRows.map((row) => {
      return [
        row.name || "N/A",
        row.value !== undefined && row.value !== null ? row.value : "N/A",
        row.unit || "",
        row.category || "N/A",
        row.timestamp ? new Date(row.timestamp).toLocaleString() : "N/A",
      ].join("\t");
    });

    const formattedText = [headerRow, ...dataRows].join("\n");

    navigator.clipboard.writeText(formattedText)
      .then(() => {
        toast.success(`Copied data for ${totalSelectedCount} ${totalSelectedCount === 1 ? "item" : "items"} to clipboard`);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-background border text-foreground px-4 py-2 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="font-medium">
        {totalSelectedCount}
        {" "}
        {totalSelectedCount === 1 ? "item" : "items"}
        {" "}
        selected
      </div>
      <div className="h-5 w-[1px] bg-border"></div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-8"
          onClick={handleExportSelected}
        >
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Export
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8"
          onClick={handleCopySelected}
        >
          <ClipboardCopy className="mr-1.5 h-3.5 w-3.5" />
          Copy
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8"
          onClick={clearSelectedRows}
        >
          <X className="mr-1.5 h-3.5 w-3.5" />
          Clear All
        </Button>
      </div>
    </div>
  );
}
