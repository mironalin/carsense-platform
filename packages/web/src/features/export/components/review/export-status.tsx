import { motion } from "framer-motion";

type ExportStatusProps = {
  isLoading: boolean;
  error: unknown;
  dataCount: number;
};

export function ExportStatus({ isLoading, error, dataCount }: ExportStatusProps) {
  if (isLoading) {
    return (
      <div className="py-4 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-32 bg-muted rounded mb-2"></div>
          <div className="h-3 w-24 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4 text-center text-destructive">
        <p>Error loading diagnostic data. Please go back and try again.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="pt-2"
    >
      <p className="text-center text-muted-foreground">
        {dataCount}
        {" "}
        records ready for export
      </p>
    </motion.div>
  );
}
