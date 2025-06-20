import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";

import type { DTCsListProps } from "../types";

import { useGetDiagnosticDTCs } from "../api/use-get-diagnostic-dtcs";
import { cardVariants } from "../utils/animation-variants";
import { DTCSeverityProvider } from "./dtc-severity-context";
import { DTCsHeader } from "./dtcs-header";
import { DTCsScrollContainer } from "./dtcs-scroll-container";
import { EmptyDTCsList } from "./dtcs-states/empty-dtcs-list";
import { ErrorLoadingDTCs } from "./dtcs-states/error-loading-dtcs";
import { NoDiagnosticSelected } from "./dtcs-states/no-diagnostic-selected";
import { DTCsListSkeleton } from "./skeleton/dtcs-list-skeleton";

// The main component wrapper that provides the severity context
export function DTCsList(props: DTCsListProps) {
  return (
    <DTCSeverityProvider>
      <DTCsListContent {...props} />
    </DTCSeverityProvider>
  );
}

// The inner component that uses the severity context
function DTCsListContent({
  diagnosticId,
  isLoading: isLoadingProp,
  error: errorProp,
}: DTCsListProps) {
  // Fetch DTCs if not provided externally
  const {
    data: dtcs,
    isLoading: isLoadingData,
    error: fetchError,
  } = useGetDiagnosticDTCs(diagnosticId);

  const isLoading = isLoadingProp || isLoadingData;
  const error = errorProp || fetchError;

  if (isLoading) {
    return <DTCsListSkeleton />;
  }

  if (!diagnosticId) {
    return <NoDiagnosticSelected />;
  }

  if (error) {
    return <ErrorLoadingDTCs />;
  }

  if (!dtcs || dtcs.length === 0) {
    return <EmptyDTCsList diagnosticId={diagnosticId} />;
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-full"
    >
      <Card className="w-full h-full flex flex-col">
        <DTCsHeader dtcs={dtcs} />
        <CardContent className="flex-1 p-4 overflow-hidden">
          <DTCsScrollContainer dtcs={dtcs} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
