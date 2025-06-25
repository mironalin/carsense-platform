import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

import type { TransferRequest } from "@/features/ownership/api/use-get-transfer-requests";

import { Separator } from "@/components/ui/separator";
import { useGetTransferRequests } from "@/features/ownership/api/use-get-transfer-requests";
import { useRespondToTransfer } from "@/features/ownership/api/use-respond-to-transfer";
import { signOut } from "@/lib/auth-client";

import type { RegisterVehiclePageProps } from "../../types";

import { pageVariants } from "../../utils/animation-variants";
import { RegisterVehicleFooter } from "../footer/register-vehicle-footer";
import { RegisterVehicleHeader } from "../header/register-vehicle-header";
import { SetupInstructionsSection } from "../sections/setup-instructions-section";
import { TransferRequestsSection } from "../sections/transfer-requests-section";

export function RegisterVehiclePage({ className }: RegisterVehiclePageProps) {
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const { data: transferRequests } = useGetTransferRequests({ suspense: true });
  const respondToTransferMutation = useRespondToTransfer();

  const pendingIncomingRequests = transferRequests?.received?.filter((req: TransferRequest) => req.status === "pending") || [];

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate({ to: "/sign-in", search: { mode: undefined, redirect: undefined, state: undefined } });
        },
        onError: (ctx) => {
          setIsSigningOut(false);
          toast.error(`Sign out failed: ${ctx.error.message}`);
        },
      },
    });
  };

  const handleTransferResponse = async (requestUuid: string, action: "accept" | "reject") => {
    try {
      await respondToTransferMutation.mutateAsync({
        requestUUID: requestUuid,
        action,
      });
    }
    catch {
      toast.error("Failed to respond to transfer request");
    }
    finally {
      navigate({ to: "/app" });
    }
  };

  return (
    <motion.div
      className={`min-h-screen bg-background ${className ?? ""}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="container mx-auto p-6 max-w-4xl space-y-8">
        <RegisterVehicleHeader />

        <TransferRequestsSection
          transferRequests={pendingIncomingRequests}
          onRespond={handleTransferResponse}
          isLoading={respondToTransferMutation.isPending}
        />

        <SetupInstructionsSection pendingRequestsCount={pendingIncomingRequests.length} />

        <Separator />

        <RegisterVehicleFooter onSignOut={handleSignOut} isSigningOut={isSigningOut} />
      </div>
    </motion.div>
  );
}
