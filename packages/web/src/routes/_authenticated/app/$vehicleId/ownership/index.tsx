import { createFileRoute, useParams } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";

import type { TransferRequest } from "@/features/ownership/api/use-get-transfer-requests";

import { ErrorPage } from "@/components/error-page";
import { LoaderPage } from "@/components/loader-page";
import { NotFoundPage } from "@/components/not-found-page";
import { useCancelTransferRequest } from "@/features/ownership/api/use-cancel-transfer-request";
import { useGetTransferRequests } from "@/features/ownership/api/use-get-transfer-requests";
import { useGetVehicleTransferHistory } from "@/features/ownership/api/use-get-vehicle-transfer-history";
import { TransferHistoryCard } from "@/features/ownership/components/transfer-history-card";
import { TransferNotificationAlert } from "@/features/ownership/components/transfer-notification-alert";
import { TransferRequestSection } from "@/features/ownership/components/transfer-request-section";
import { VehicleInfoCard } from "@/features/ownership/components/vehicle-info-card";
import { pageVariants } from "@/features/ownership/utils/animation-variants";
import { useGetVehicleById } from "@/features/vehicles/api/use-get-vehicle-by-id";

export const Route = createFileRoute(
  "/_authenticated/app/$vehicleId/ownership/",
)({
  component: RouteComponent,
  pendingComponent: () => <LoaderPage />,
  notFoundComponent: () => <NotFoundPage />,
  errorComponent: () => <ErrorPage />,
});

function RouteComponent() {
  const { vehicleId } = useParams({ from: "/_authenticated/app/$vehicleId/ownership/" });

  const { data: transferRequests, isLoading: transfersLoading } = useGetTransferRequests({ suspense: true });
  const { data: vehicle, isLoading: vehicleLoading } = useGetVehicleById({ vehicleId });
  const { data: vehicleHistory, isLoading: historyLoading } = useGetVehicleTransferHistory({ vehicleUUID: vehicleId });
  const cancelTransferMutation = useCancelTransferRequest();

  const handleCancelTransfer = async (requestUuid: string) => {
    try {
      await cancelTransferMutation.mutateAsync({
        requestUUID: requestUuid,
      });

      toast.success("Transfer request cancelled");
    }
    catch {
      // Error handled by the mutation
    }
  };

  // Filter requests for this specific vehicle
  const vehicleRequests = transferRequests?.sent?.filter((req: TransferRequest) => req.vehicleUUID === vehicleId) || [];
  const pendingRequest = vehicleRequests.find((req: TransferRequest) => req.status === "pending");
  const hasActiveRequest = !!pendingRequest;

  const isLoading = transfersLoading || vehicleLoading || historyLoading;

  if (isLoading) {
    return <LoaderPage />;
  }

  return (
    <motion.div
      className="container mx-auto p-4 lg:p-6 space-y-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="space-y-6">
        {/* Vehicle Info Card */}
        {vehicle && <VehicleInfoCard vehicle={vehicle} />}

        <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
          {/* Transfer Request Section */}
          <TransferRequestSection
            vehicleId={vehicleId}
            hasActiveRequest={hasActiveRequest}
            pendingRequest={pendingRequest}
            onCancelRequest={handleCancelTransfer}
            isCancelLoading={cancelTransferMutation.isPending}
          />

          {/* Transfer History */}
          <TransferHistoryCard vehicleHistory={vehicleHistory} />
        </div>

        {/* Additional Info */}
        <TransferNotificationAlert />
      </div>
    </motion.div>
  );
}
