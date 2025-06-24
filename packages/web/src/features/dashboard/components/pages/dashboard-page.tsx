import { motion } from "framer-motion";
import { Car } from "lucide-react";

import { LoaderPage } from "@/components/loader-page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import type { DashboardPageProps } from "../../types";

import { useGetDashboardOverview } from "../../api/use-get-dashboard-overview";
import { containerVariants } from "../../utils/animation-variants";
import { HealthTrendsSection } from "../sections/health-trends-section";
import { QuickStatsSection } from "../sections/quick-stats-section";
import { RecentActivitySection } from "../sections/recent-activity-section";
import { VehicleStatusSection } from "../sections/vehicle-status-section";

export function DashboardPage({ vehicleId }: DashboardPageProps) {
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useGetDashboardOverview({ vehicleUUID: vehicleId });

  if (isLoading) {
    return <LoaderPage />;
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 lg:p-6"
      >
        <Alert variant="destructive">
          <Car className="h-4 w-4" />
          <AlertTitle>Error loading dashboard</AlertTitle>
          <AlertDescription>
            Failed to load dashboard data. Please try again later.
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  if (!dashboardData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 lg:p-6"
      >
        <Alert>
          <Car className="h-4 w-4" />
          <AlertTitle>No dashboard data</AlertTitle>
          <AlertDescription>
            No dashboard data available for this vehicle.
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  const { vehicleStatus, quickStats, recentActivity, healthTrends } = dashboardData;

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Vehicle Status Section */}
        <VehicleStatusSection vehicleStatus={vehicleStatus} />

        {/* Quick Stats Section */}
        <QuickStatsSection quickStats={quickStats} />

        {/* Recent Activity and Health Trends */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:items-stretch">
          <div className="xl:col-span-2 flex">
            <RecentActivitySection recentActivity={recentActivity} />
          </div>

          {/* Health Trends Chart */}
          <div className="xl:col-span-1 flex">
            <HealthTrendsSection healthTrends={healthTrends} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
