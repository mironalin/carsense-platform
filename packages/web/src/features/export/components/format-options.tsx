import { motion } from "framer-motion";
import { FileDown } from "lucide-react";

import { CardTitle } from "@/components/ui/card";

import type { ExportFormat } from "../types";

import { listAnimation, listItemAnimation } from "../utils/animation-variants";

type FormatOptionsProps = {
  exportFormat: ExportFormat;
  onFormatChange: (format: ExportFormat) => void;
};

export function FormatOptions({ exportFormat, onFormatChange }: FormatOptionsProps) {
  return (
    <motion.div
      key="format-tab"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <CardTitle className="text-lg">Choose Export Format</CardTitle>
      <motion.div
        className="grid grid-cols-1 gap-3 pt-2"
        variants={listAnimation}
        initial="hidden"
        animate="visible"
      >
        <FormatOption
          format="csv"
          title="CSV"
          description="Comma separated values format"
          isSelected={exportFormat === "csv"}
          onClick={() => onFormatChange("csv")}
        />

        <FormatOption
          format="xlsx"
          title="XLSX"
          description="Microsoft Excel spreadsheet format"
          isSelected={exportFormat === "xlsx"}
          onClick={() => onFormatChange("xlsx")}
        />

        <FormatOption
          format="json"
          title="JSON"
          description="JavaScript Object Notation format"
          isSelected={exportFormat === "json"}
          onClick={() => onFormatChange("json")}
        />
      </motion.div>
    </motion.div>
  );
}

type FormatOptionProps = {
  format?: ExportFormat;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
};

function FormatOption({ format: _format, title, description, isSelected, onClick }: FormatOptionProps) {
  return (
    <motion.div
      variants={listItemAnimation}
      className={`
        flex items-center justify-between px-4 py-3 rounded overflow-hidden
        ${isSelected
      ? "bg-primary/10 border border-primary/30"
      : "bg-muted/40 border border-muted hover:bg-muted/60"}
        transition-colors cursor-pointer relative
      `}
      onClick={onClick}
      whileHover={{
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        borderColor: isSelected ? "var(--primary)" : "var(--border)",
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center space-x-3">
        <FileDown className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <motion.div
        className="w-3 h-3 rounded-full ml-2 flex-shrink-0"
        animate={{
          backgroundColor: isSelected ? "var(--primary)" : "rgba(125,125,125,0.3)",
          scale: isSelected ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
