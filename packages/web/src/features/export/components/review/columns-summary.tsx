import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";

import type { ColumnDefinition } from "../../types";

type ColumnsSummaryProps = {
  columns: ColumnDefinition[];
};

export function ColumnsSummary({ columns }: ColumnsSummaryProps) {
  const selectedColumns = columns.filter(col => col.selected);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="space-y-2"
    >
      <div className="flex justify-between">
        <h3 className="font-medium">Selected Columns</h3>
        <span className="text-sm text-muted-foreground">
          {selectedColumns.length}
          {" "}
          selected
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedColumns.map((col, index) => (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02 + 0.3, duration: 0.3 }}
          >
            <Badge variant="outline">
              {col.name}
            </Badge>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
