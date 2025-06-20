import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { ColumnDefinition } from "../types";

import { buttonAnimation, listAnimation, listItemAnimation } from "../utils/animation-variants";

type ColumnOptionsProps = {
  columns: ColumnDefinition[];
  onColumnToggle: (columnId: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
};

export function ColumnOptions({ columns, onColumnToggle, onSelectAll, onClearAll }: ColumnOptionsProps) {
  const selectedColumns = columns.filter(col => col.selected);

  return (
    <motion.div
      key="columns-tab"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center">
        <CardTitle className="text-lg">Select Columns to Export</CardTitle>
        <div className="flex items-center gap-2">
          <motion.div
            variants={buttonAnimation}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAll}
              disabled={columns.every(col => !col.selected)}
              className="h-8 text-xs"
            >
              Clear All
            </Button>
          </motion.div>
          <motion.div
            variants={buttonAnimation}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={onSelectAll}
              disabled={columns.every(col => col.selected)}
              className="h-8 text-xs"
            >
              Select All
            </Button>
          </motion.div>
        </div>
      </div>
      <div className="pt-2">
        <Badge variant="outline" className="mb-3 text-xs px-1.5 py-0">
          {selectedColumns.length}
          {" "}
          selected
        </Badge>
        <ScrollArea className="h-[240px] pr-2 -mr-2">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-1.5"
            variants={listAnimation}
            initial="hidden"
            animate="visible"
          >
            {columns.map((column, index) => (
              <ColumnOption
                key={column.id}
                column={column}
                index={index}
                onToggle={() => onColumnToggle(column.id)}
              />
            ))}
          </motion.div>
        </ScrollArea>
      </div>
    </motion.div>
  );
}

type ColumnOptionProps = {
  column: ColumnDefinition;
  index: number;
  onToggle: () => void;
};

function ColumnOption({ column, index, onToggle }: ColumnOptionProps) {
  return (
    <motion.div
      variants={listItemAnimation}
      custom={index}
      className={`
        flex items-center justify-between px-3 py-2 rounded overflow-hidden
        ${column.selected
      ? "bg-primary/10 border border-primary/30"
      : "bg-muted/40 border border-muted hover:bg-muted/60"}
        transition-colors cursor-pointer relative
      `}
      onClick={onToggle}
      whileHover={{
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        borderColor: column.selected ? "var(--primary)" : "var(--border)",
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="text-xs font-medium truncate max-w-[160px]">
        {column.name}
      </span>
      <motion.div
        className="w-3 h-3 rounded-full ml-2 flex-shrink-0"
        animate={{
          backgroundColor: column.selected ? "var(--primary)" : "rgba(125,125,125,0.3)",
          scale: column.selected ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
