import { motion } from "framer-motion";
import { FileJson, FileSpreadsheet, FileText } from "lucide-react";

import type { ExportFormat } from "../../types";

type FormatSummaryProps = {
  format: ExportFormat;
};

export function FormatSummary({ format }: FormatSummaryProps) {
  const getFormatIcon = () => {
    switch (format) {
      case "csv":
        return <FileText className="h-5 w-5" />;
      case "xlsx":
        return <FileSpreadsheet className="h-5 w-5" />;
      case "json":
        return <FileJson className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="space-y-2"
    >
      <h3 className="font-medium">Export Format</h3>
      <div className="flex items-center gap-2">
        {getFormatIcon()}
        <span className="capitalize">{format.toUpperCase()}</span>
      </div>
    </motion.div>
  );
}
