import { motion } from "framer-motion";
import { Download, MoveLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { ExportFormat } from "../../types";

type ExportActionFooterProps = {
  onBack: () => void;
  onExport: () => void;
  isLoading: boolean;
  hasError: boolean;
  dataCount: number;
  isExporting: boolean;
  format: ExportFormat;
};

export function ExportActionFooter({
  onBack,
  onExport,
  isLoading,
  hasError,
  dataCount,
  isExporting,
  format,
}: ExportActionFooterProps) {
  const isExportDisabled = isLoading || hasError || dataCount === 0 || isExporting;

  return (
    <div className="flex justify-between w-full">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button variant="ghost" onClick={onBack}>
          <MoveLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={onExport}
          disabled={isExportDisabled}
        >
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Exporting..." : `Export ${format.toUpperCase()}`}
        </Button>
      </motion.div>
    </div>
  );
}
