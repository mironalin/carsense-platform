import { motion } from "framer-motion";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { DiagnosticItem } from "../../types";

import { listAnimation } from "../../utils/animation-variants";
import { DiagnosticItemComponent } from "./diagnostic-item";

type DiagnosticsListProps = {
  diagnosticsByCategory: Record<string, DiagnosticItem[]>;
  isItemSelected: (id: string) => boolean;
  onItemToggle: (item: DiagnosticItem) => void;
};

export function DiagnosticsList({
  diagnosticsByCategory,
  isItemSelected,
  onItemToggle,
}: DiagnosticsListProps) {
  // Generate a unique key based on the categories to force animation reset when data changes
  const listKey = Object.keys(diagnosticsByCategory).join("-");

  // Calculate total number of diagnostics
  const totalDiagnostics = useMemo(() => {
    return Object.values(diagnosticsByCategory).reduce((acc, items) => acc + items.length, 0);
  }, [diagnosticsByCategory]);

  // Calculate height based on number of diagnostics
  // Each diagnostic item is 60px height + 6px for margins/gap (1.5)
  // Each category header is roughly 30px
  // We want to show max 5 diagnostics before scrolling
  const categoryCount = Object.keys(diagnosticsByCategory).length;
  const maxItemsBeforeScroll = 5;
  const itemHeight = 66; // 60px height + 6px gap
  const headerHeight = 30; // px per category header
  const padding = 0; // px padding

  // Calculate dynamic height with a minimum and maximum
  let height = Math.min(
    // Height for all items
    totalDiagnostics * itemHeight + categoryCount * headerHeight + padding,
    // Maximum height (5 items)
    maxItemsBeforeScroll * itemHeight + Math.min(categoryCount, 3) * headerHeight + padding,
  );

  // Ensure minimum height for empty or very small lists
  if (totalDiagnostics === 0) {
    height = 100; // Empty state
  }
  else if (totalDiagnostics <= 3) {
    // For 1-3 items, use exact height needed
    height = totalDiagnostics * itemHeight + categoryCount * headerHeight + padding;
  }

  return (
    <ScrollArea className="pr-2 -mr-2" style={{ height }}>
      <motion.div
        key={listKey}
        className="space-y-4"
        variants={listAnimation}
        initial="hidden"
        animate="visible"
      >
        {Object.keys(diagnosticsByCategory).length === 0
          ? (
              <p className="text-center py-4 text-muted-foreground">No diagnostics found</p>
            )
          : (
              Object.entries(diagnosticsByCategory).map(([category, items], categoryIndex) => (
                <motion.div
                  key={category}
                  className="space-y-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: categoryIndex * 0.1, duration: 0.4 }}
                >
                  <div className="flex items-center gap-1.5 text-sm font-medium pb-1 border-b">
                    <span>{category}</span>
                    <Badge variant="outline" className="ml-1.5 text-xs px-1.5 py-0">
                      {items.length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {items.map((diag, index) => (
                      <DiagnosticItemComponent
                        key={diag.id}
                        diagnostic={diag}
                        index={index}
                        isSelected={isItemSelected(diag.id)}
                        onToggle={onItemToggle}
                      />
                    ))}
                  </div>
                </motion.div>
              ))
            )}
      </motion.div>
    </ScrollArea>
  );
}
