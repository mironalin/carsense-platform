import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { ExportFormat } from "../../types";

type FileNameInputProps = {
  fileName: string;
  onChange: (value: string) => void;
  format: ExportFormat;
};

export function FileNameInput({ fileName, onChange, format }: FileNameInputProps) {
  // Generate a default filename with the current timestamp for preview
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").substring(0, 19);
  const defaultName = `vehicle-diagnostics-${timestamp}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="space-y-2"
    >
      <Label htmlFor="filename">File Name (Optional)</Label>
      <Input
        id="filename"
        value={fileName}
        onChange={e => onChange(e.target.value)}
        placeholder="Enter custom filename or leave blank for default"
        className="w-full"
      />
      <p className="text-sm text-muted-foreground">
        {fileName.trim()
          ? `Your file will be saved as: ${fileName.trim()}.${format}`
          : `Default name: ${defaultName}.${format}`}
      </p>
    </motion.div>
  );
}
