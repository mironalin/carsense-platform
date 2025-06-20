import type { SensorData } from "../types";

/**
 * Convert sensor data to CSV format
 * @param data Array of sensor data objects
 * @returns CSV string
 */
export function convertSensorDataToCsv(data: SensorData[]): string {
  if (!data || data.length === 0) {
    return "";
  }

  // Define CSV headers based on available properties
  const headers = ["PID", "Name", "Value", "Unit", "Category", "Timestamp"];

  // Create CSV content starting with headers
  let csvContent = `${headers.join(",")}\n`;

  // Add each row of data
  data.forEach((item) => {
    // Format timestamp if available
    const formattedTimestamp = item.timestamp
      ? new Date(item.timestamp).toLocaleString()
      : "";

    // Format value with proper handling for null/undefined
    const formattedValue = item.value !== undefined && item.value !== null
      ? String(item.value)
      : "";

    // Create row with proper CSV escaping
    const row = [
      escapeCsvValue(item.pid || ""),
      escapeCsvValue(item.name || ""),
      escapeCsvValue(formattedValue),
      escapeCsvValue(item.unit || ""),
      escapeCsvValue(item.category || ""),
      escapeCsvValue(formattedTimestamp),
    ].join(",");

    csvContent += `${row}\n`;
  });

  return csvContent;
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

  // Create download link and trigger download
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
