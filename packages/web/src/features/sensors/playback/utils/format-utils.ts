// Format time in HH:MM:SS.MMM format
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const milliseconds = Math.floor(ms % 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
}

// Format a number to a fixed precision with unit
export function formatValueWithUnit(value: number, unit: string, precision: number = 2): string {
  return `${value.toFixed(precision)} ${unit}`;
}

// Calculate percentage change between two values
export function calculatePercentChange(currentValue: number, previousValue: number): number {
  return ((currentValue - previousValue) / previousValue) * 100;
}

// Get percentage for progress bar based on min/max range
export function getPercentageInRange(value: number, min: number, max: number): number {
  if (min === max)
    return 50; // Avoid division by zero
  return ((value - min) / (max - min)) * 100;
}
