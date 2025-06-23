import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

import { ErrorPage } from "@/components/error-page";
import { LoaderPage } from "@/components/loader-page";
import { NotFoundPage } from "@/components/not-found-page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMaintenanceHistoryQueryOptions, useGetMaintenanceHistory } from "@/features/maintenance/api/use-get-maintenance-history";
import { AddMaintenanceDialog } from "@/features/maintenance/components/forms/add-maintenance-dialog";
import { MaintenanceHistoryList } from "@/features/maintenance/components/history/maintenance-history-list";
import { MaintenanceSummary } from "@/features/maintenance/components/summary/maintenance-summary";
import { MaintenanceSummarySkeleton } from "@/features/maintenance/components/summary/maintenance-summary-skeleton";
import { containerVariants, itemVariants } from "@/features/maintenance/utils/animation-variants";

export const Route = createFileRoute(
  "/_authenticated/app/$vehicleId/maintenance/",
)({
  loader: async ({ context, params }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(getMaintenanceHistoryQueryOptions({ vehicleUUID: params.vehicleId }));
  },
  component: RouteComponent,
  pendingComponent: () => <LoaderPage />,
  notFoundComponent: () => <NotFoundPage />,
  errorComponent: () => <ErrorPage />,
});

function RouteComponent() {
  const { vehicleId } = Route.useParams();

  const {
    data: maintenanceData,
    isLoading,
  } = useGetMaintenanceHistory({ vehicleUUID: vehicleId, suspense: true });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto p-6 space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Maintenance</h1>
          <p className="text-muted-foreground">
            {maintenanceData?.vehicleInfo
              ? `Manage maintenance records for your ${maintenanceData.vehicleInfo.year} ${maintenanceData.vehicleInfo.make} ${maintenanceData.vehicleInfo.model}`
              : "Manage your vehicle maintenance records"}
          </p>
        </div>
        <AddMaintenanceDialog vehicleUUID={vehicleId} />
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants}>
        {isLoading
          ? (
              <MaintenanceSummarySkeleton />
            )
          : maintenanceData
            ? (
                <MaintenanceSummary summary={maintenanceData.summary} />
              )
            : null}
      </motion.div>

      {/* Maintenance History */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Maintenance History
              {maintenanceData && (
                <Badge variant="secondary" className="text-xs">
                  {maintenanceData.maintenanceHistory.length}
                  {" "}
                  {maintenanceData.maintenanceHistory.length === 1 ? "entry" : "entries"}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MaintenanceHistoryList
              entries={maintenanceData?.maintenanceHistory || []}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
