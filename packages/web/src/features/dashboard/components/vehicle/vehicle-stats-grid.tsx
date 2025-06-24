import { AlertTriangle, Calendar, Gauge, Stethoscope } from "lucide-react";

import { StatItem } from "../shared/stat-item";

type VehicleStatsGridProps = {
  totalDiagnosticsCount: number;
  activeDTCsCount: number;
  daysSinceLastDiagnostic: number | null;
  latestOdometer: number | null;
};

export function VehicleStatsGrid({
  totalDiagnosticsCount,
  activeDTCsCount,
  daysSinceLastDiagnostic,
  latestOdometer,
}: VehicleStatsGridProps) {
  const formatKilometers = (kilometers: number) => {
    return new Intl.NumberFormat("en-US").format(kilometers);
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatItem
        icon={<Stethoscope className="h-4 w-4" />}
        value={totalDiagnosticsCount}
        label="Total Diagnostics"
        color="default"
      />
      <StatItem
        icon={<AlertTriangle className="h-4 w-4" />}
        value={activeDTCsCount}
        label="Active DTCs"
        color={activeDTCsCount > 0 ? "danger" : "success"}
      />
      <StatItem
        icon={<Calendar className="h-4 w-4" />}
        value={daysSinceLastDiagnostic || "0"}
        label="Days Since Last Diagnostic"
        color={
          !daysSinceLastDiagnostic || daysSinceLastDiagnostic <= 7
            ? "success"
            : daysSinceLastDiagnostic <= 30
              ? "warning"
              : "danger"
        }
      />
      <StatItem
        icon={<Gauge className="h-4 w-4" />}
        value={latestOdometer ? `${formatKilometers(latestOdometer)}` : "--"}
        label="Kilometers"
        color="default"
      />
    </div>
  );
}
