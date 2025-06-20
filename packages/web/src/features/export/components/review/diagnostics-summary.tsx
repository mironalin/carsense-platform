import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";

import type { DiagnosticItem } from "../../types";

type DiagnosticsSummaryProps = {
  diagnostics: DiagnosticItem[];
};

export function DiagnosticsSummary({ diagnostics }: DiagnosticsSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="space-y-2"
    >
      <div className="flex justify-between">
        <h3 className="font-medium">Selected Diagnostics</h3>
        <span className="text-sm text-muted-foreground">
          {diagnostics.length}
          {" "}
          selected
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {diagnostics.map((diag, index) => (
          <motion.div
            key={diag.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02 + 0.2, duration: 0.3 }}
          >
            <Badge variant="outline">
              {diag.name}
            </Badge>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
