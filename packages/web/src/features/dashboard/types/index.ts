// Dashboard API Response Types
export type VehicleStatus = {
  vehicleUUID: string;
  make: string;
  model: string;
  year: number;
  vin: string | null;
  latestOdometer: number | null;
  lastDiagnosticDate: string | null;
  daysSinceLastDiagnostic: number | null;
  activeDTCsCount: number;
  totalDiagnosticsCount: number;
};

export type QuickStats = {
  totalDiagnostics: number;
  totalMaintenance: number;
  totalNotifications: number;
  activeDTCs: number;
  maintenanceCostYTD: number;
  averageDiagnosticInterval: number | null;
};

export type RecentActivity = {
  type: "diagnostic" | "maintenance" | "dtc" | "notification";
  id: string;
  title: string;
  description: string | null;
  date: string;
  severity?: "low" | "medium" | "high";
};

export type HealthTrend = {
  date: string;
  healthScore: number; // 0-100, higher is better
  dtcsCount: number;
  maintenanceCost: number;
  odometerReading: number;
  dailyMileage: number;
};

export type DashboardOverview = {
  vehicleStatus: VehicleStatus;
  quickStats: QuickStats;
  recentActivity: RecentActivity[];
  healthTrends: HealthTrend[];
};

// Component Props Types
export type DashboardPageProps = {
  vehicleId: string;
};
