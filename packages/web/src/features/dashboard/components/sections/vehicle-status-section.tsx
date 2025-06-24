import { motion } from "framer-motion";
import { Car } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { VehicleStatus } from "../../types";

import { itemVariants } from "../../utils/animation-variants";
import { getBadgeVariant, getStatusColor, getStatusText } from "../../utils/vehicle-status-utils";
import { LastDiagnosticInfo } from "../vehicle/last-diagnostic-info";
import { VehicleAlert } from "../vehicle/vehicle-alert";
import { VehicleInfoHeader } from "../vehicle/vehicle-info-header";
import { VehicleStatsGrid } from "../vehicle/vehicle-stats-grid";

type VehicleStatusSectionProps = {
  vehicleStatus: VehicleStatus;
};

export function VehicleStatusSection({ vehicleStatus }: VehicleStatusSectionProps) {
  const {
    make,
    model,
    year,
    vin,
    latestOdometer,
    lastDiagnosticDate,
    daysSinceLastDiagnostic,
    activeDTCsCount,
    totalDiagnosticsCount,
  } = vehicleStatus;

  const statusColor = getStatusColor(daysSinceLastDiagnostic);
  const statusText = getStatusText(daysSinceLastDiagnostic);

  return (
    <motion.div variants={itemVariants}>
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Car className="h-5 w-5 text-primary" />
                Vehicle Status
              </CardTitle>
              <CardDescription className="text-sm">
                Current status and health overview
              </CardDescription>
            </div>
            <Badge
              variant={getBadgeVariant(statusColor)}
              className="text-xs font-medium"
            >
              {statusText}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <VehicleInfoHeader
            make={make}
            model={model}
            year={year}
            vin={vin}
          />

          <VehicleStatsGrid
            totalDiagnosticsCount={totalDiagnosticsCount}
            activeDTCsCount={activeDTCsCount}
            daysSinceLastDiagnostic={daysSinceLastDiagnostic}
            latestOdometer={latestOdometer}
          />

          {lastDiagnosticDate && (
            <LastDiagnosticInfo lastDiagnosticDate={lastDiagnosticDate} />
          )}

          <VehicleAlert activeDTCsCount={activeDTCsCount} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
