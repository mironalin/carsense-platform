import { format } from "date-fns";
import { motion } from "framer-motion";

type DateRangeSummaryProps = {
  includeAllData: boolean;
  dateRange?: {
    startDate: Date | null;
    endDate: Date | null;
  };
};

export function DateRangeSummary({ includeAllData, dateRange }: DateRangeSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="space-y-2"
    >
      <h3 className="font-medium">Data Range</h3>
      {includeAllData
        ? (
            <p className="text-muted-foreground">All available data</p>
          )
        : dateRange?.startDate && dateRange?.endDate
          ? (
              <p className="text-muted-foreground">
                {format(dateRange.startDate, "MMM d, yyyy")}
                {" "}
                -
                {format(dateRange.endDate, "MMM d, yyyy")}
              </p>
            )
          : (
              <p className="text-muted-foreground">No date range specified</p>
            )}
    </motion.div>
  );
}
