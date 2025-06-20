import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

import { DiagnosticsPage } from "@/features/diagnostics/components/diagnostics-page";
import { pageVariants } from "@/features/diagnostics/utils/animation-variants";

export const Route = createFileRoute(
  "/_authenticated/app/$vehicleId/diagnostics/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <DiagnosticsPage />
    </motion.div>
  );
}
