import { motion } from "framer-motion";
import { Mail, Plus, Smartphone, Users } from "lucide-react";

import { cardAnimation } from "../../utils/animation-variants";
import { SetupInstructionCard } from "../cards/setup-instruction-card";

type SetupInstructionsSectionProps = {
  pendingRequestsCount: number;
};

export function SetupInstructionsSection({ pendingRequestsCount }: SetupInstructionsSectionProps) {
  const mobileSteps = [
    {
      number: 1,
      description: "Download the CarSense Android app from the Google Play Store",
    },
    {
      number: 2,
      description: "Connect your OBD-II device to your vehicle's diagnostic port",
    },
    {
      number: 3,
      description: "Sign in with the same account and follow the setup wizard",
    },
    {
      number: 4,
      description: "Your vehicle will automatically appear in your dashboard",
    },
  ];

  const transferSteps = [
    {
      number: 1,
      description: "Another CarSense user initiates a transfer to your email address",
    },
    {
      number: 2,
      description: "You'll receive a transfer request notification on this page or in the app",
    },
    {
      number: 3,
      description: "Review and accept the transfer request on this page to complete the transfer",
    },
    {
      number: 4,
      description: "The vehicle will be added to your account with full access",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Add Vehicle via Android App */}
      <motion.div
        variants={cardAnimation}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <SetupInstructionCard
          icon={<Smartphone className="h-5 w-5 text-primary" />}
          title="Add Vehicle via Android App"
          description="Connect your vehicle using the CarSense Android application"
          steps={mobileSteps}
          alertIcon={<Plus className="h-4 w-4" />}
          alertTitle="Quick Setup"
          alertDescription="The mobile app will guide you through connecting your vehicle and start collecting diagnostic data immediately."
        />
      </motion.div>

      {/* Wait for Transfer */}
      <motion.div
        variants={cardAnimation}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <SetupInstructionCard
          icon={<Users className="h-5 w-5 text-primary" />}
          title="Vehicle Transfer"
          description="Use CarSense without the Android app via vehicle transfer"
          steps={transferSteps}
          alertIcon={<Mail className="h-4 w-4" />}
          alertTitle="Transfer Requests"
          alertDescription={
            pendingRequestsCount > 0
              ? `You have ${pendingRequestsCount} pending transfer request${pendingRequestsCount > 1 ? "s" : ""} above.`
              : "No pending transfer requests. Ask a vehicle owner to send you one."
          }
        />
      </motion.div>
    </div>
  );
}
