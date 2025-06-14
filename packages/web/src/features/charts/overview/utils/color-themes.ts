import type { ColorTheme } from "../types";

// Define color themes
export const colorThemes: Record<ColorTheme, { name: string; colors: Record<string, string> }> = {
  default: {
    name: "Default",
    colors: {
      Engine: "#3b82f6", // Blue - representing engine performance
      Temperature: "#ef4444", // Red - representing heat/temperature
      Electrical: "#f59e0b", // Amber - representing electrical systems
      Fluid: "#06b6d4", // Cyan - representing fluids (water, oil)
      Emissions: "#10b981", // Emerald - representing environmental/emissions
      Other: "#6b7280", // Gray - for miscellaneous sensors
    },
  },
  vibrant: {
    name: "Vibrant",
    colors: {
      Engine: "#4f46e5", // Indigo - bold and vibrant
      Temperature: "#dc2626", // Bright red
      Electrical: "#f97316", // Bright orange
      Fluid: "#0ea5e9", // Sky blue
      Emissions: "#16a34a", // Green
      Other: "#8b5cf6", // Purple
    },
  },
  pastel: {
    name: "Pastel",
    colors: {
      Engine: "#93c5fd", // Light blue
      Temperature: "#fca5a5", // Light red
      Electrical: "#fdba74", // Light orange
      Fluid: "#a5f3fc", // Light cyan
      Emissions: "#86efac", // Light green
      Other: "#d1d5db", // Light gray
    },
  },
  monochrome: {
    name: "Monochrome",
    colors: {
      Engine: "#1e293b", // Dark slate
      Temperature: "#334155", // Slate
      Electrical: "#475569", // Slate
      Fluid: "#64748b", // Slate
      Emissions: "#94a3b8", // Light slate
      Other: "#cbd5e1", // Lightest slate
    },
  },
  neon: {
    name: "Neon",
    colors: {
      Engine: "#00ffff", // Cyan
      Temperature: "#ff00ff", // Magenta
      Electrical: "#ffff00", // Yellow
      Fluid: "#00ff00", // Green
      Emissions: "#ff0000", // Red
      Other: "#0000ff", // Blue
    },
  },
};
