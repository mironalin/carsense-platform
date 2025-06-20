import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

import { ExportLayout } from "@/features/export/components/export-layout";
import { pageVariants } from "@/features/export/utils/animation-variants";

export const Route = createFileRoute(
  "/_authenticated/app/$vehicleId/export/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <motion.div
      className="container mx-auto space-y-4 p-4 lg:p-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <ExportLayout />
    </motion.div>
  );
}
