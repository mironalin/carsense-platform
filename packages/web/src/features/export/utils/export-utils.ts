import { utils as XLSXUtils, write as XLSXWrite } from "xlsx";

import type { ColumnDefinition } from "../types";

/**
 * Convert diagnostic data to CSV format
 * @param data Array of diagnostic data objects
 * @param columns Array of column definitions to include in the export
 * @returns CSV string
 */
export function convertDiagnosticsDataToCsv(data: any[], columns: ColumnDefinition[]): string {
  if (!data || data.length === 0 || columns.length === 0) {
    return "";
  }

  // Create headers from selected columns
  const headers = columns.map(col => col.name);

  // Start CSV content with headers
  let csvContent = `${headers.join(",")}\n`;

  // Add each row of data
  data.forEach((item) => {
    const row = columns.map((col) => {
      const value = item[col.id];
      return escapeCsvValue(formatValue(value, col.id));
    }).join(",");

    csvContent += `${row}\n`;
  });

  return csvContent;
}

/**
 * Format value based on column type
 * @param value Value to format
 * @param columnId Column ID to determine formatting
 * @returns Formatted value as string
 */
function formatValue(value: any, columnId: string): string {
  if (value === undefined || value === null) {
    return "";
  }

  if (columnId === "timestamp" && value) {
    return new Date(value).toLocaleString();
  }

  return String(value);
}

/**
 * Helper function to escape special characters in CSV values
 * @param value String value to escape
 * @returns Properly escaped CSV value
 */
function escapeCsvValue(value: string): string {
  // If value contains commas, quotes, or newlines, wrap in quotes and escape quotes
  if (value.includes(",") || value.includes("\"") || value.includes("\n")) {
    return `"${value.replace(/"/g, "\"\"")}"`;
  }
  return value;
}

/**
 * Download data as CSV file
 * @param csvData CSV string data
 * @param filename Name of the file to download
 */
export function downloadCsv(csvData: string, filename: string): void {
  // Create a Blob with the CSV data
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, filename);
}

/**
 * Download data as JSON file
 * @param data Array of data objects
 * @param columns Array of column definitions to include in the export
 * @param filename Name of the file to download
 */
export function downloadJson(data: any[], columns: ColumnDefinition[], filename: string): void {
  if (!data || data.length === 0) {
    return;
  }

  // Filter data to only include selected columns
  const filteredData = data.map((item) => {
    const result: Record<string, any> = {};
    columns.forEach((col) => {
      if (col.selected) {
        result[col.id] = item[col.id];
      }
    });
    return result;
  });

  const jsonStr = JSON.stringify(filteredData, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  downloadBlob(blob, filename);
}

/**
 * Download data as XLSX file
 * @param data Array of data objects
 * @param columns Array of column definitions to include in the export
 * @param filename Name of the file to download
 * @returns {boolean} Success status of the operation
 */
export function downloadXlsx(data: any[], columns: ColumnDefinition[], filename: string): boolean {
  if (!data || data.length === 0 || !columns.some(col => col.selected)) {
    console.error("No data or columns selected for XLSX export");
    return false;
  }

  try {
    // Filter the columns to only include selected ones
    const selectedColumns = columns.filter(col => col.selected);

    // Prepare the worksheet data
    const worksheetData = [
      // Header row with column names
      selectedColumns.map(col => col.name),
    ];

    // Add data rows
    data.forEach((item) => {
      const row: any[] = [];
      selectedColumns.forEach((col) => {
        // Format the value if needed
        const value = col.id === "timestamp" && item[col.id]
          ? new Date(item[col.id])
          : item[col.id];
        row.push(value !== undefined ? value : "");
      });
      worksheetData.push(row);
    });

    // Create a worksheet from the data
    const worksheet = XLSXUtils.aoa_to_sheet(worksheetData);

    // Create a workbook with the worksheet
    const workbook = {
      SheetNames: ["Diagnostics"],
      Sheets: {
        Diagnostics: worksheet,
      },
    };

    // Generate the XLSX file as an array buffer
    const excelBuffer = XLSXWrite(workbook, { type: "array", bookType: "xlsx" });

    // Create a Blob from the buffer
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Download the file
    downloadBlob(blob, filename);
    return true;
  }
  catch (error) {
    console.error("Error generating XLSX file:", error);
    // Return false to indicate failure, can be handled by the calling code
    return false;
  }
}

/**
 * Helper function to download a Blob as a file
 * @param blob Blob to download
 * @param filename Name of the file to download
 */
function downloadBlob(blob: Blob, filename: string): void {
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
