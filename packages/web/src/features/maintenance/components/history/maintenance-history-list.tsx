import { motion } from "framer-motion";

import type { MaintenanceEntry } from "../../types";

import { containerVariants } from "../../utils/animation-variants";
import { MaintenanceEntryCard } from "../cards/maintenance-entry-card";
import { MaintenanceHistoryEmpty } from "./maintenance-history-empty";
import { MaintenanceHistorySkeleton } from "./maintenance-history-skeleton";

type MaintenanceHistoryListProps = {
  entries: MaintenanceEntry[];
  isLoading?: boolean;
};

export function MaintenanceHistoryList({ entries, isLoading }: MaintenanceHistoryListProps) {
  if (isLoading) {
    return <MaintenanceHistorySkeleton />;
  }

  if (entries.length === 0) {
    return <MaintenanceHistoryEmpty />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {entries.map((entry, index) => (
        <MaintenanceEntryCard
          key={entry.uuid}
          entry={entry}
          index={index}
        />
      ))}
    </motion.div>
  );
}
