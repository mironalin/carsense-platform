import { motion } from "framer-motion";
import { Calendar, Gauge } from "lucide-react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import type { DiagnosticItem } from "../../types";

import { listItemAnimation } from "../../utils/animation-variants";

type DiagnosticItemProps = {
  diagnostic: DiagnosticItem;
  index: number;
  isSelected: boolean;
  onToggle: (item: DiagnosticItem) => void;
};

export function DiagnosticItemComponent({
  diagnostic,
  index,
  isSelected,
  onToggle,
}: DiagnosticItemProps) {
  return (
    <motion.div
      key={diagnostic.id}
      variants={listItemAnimation}
      initial="hidden"
      animate="visible"
      custom={index}
      className={`
        flex items-center justify-between px-3 py-2 rounded overflow-hidden h-[60px]
        ${isSelected
      ? "bg-primary/10 border border-primary/30"
      : "bg-muted/40 border border-muted hover:bg-muted/60"}
        transition-colors cursor-pointer relative
      `}
      onClick={() => onToggle(diagnostic)}
      whileHover={{
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        borderColor: isSelected ? "var(--primary)" : "var(--border)",
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex flex-col w-full justify-between">
        <div className="flex items-center justify-between">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs font-medium truncate max-w-[160px]">
                  {diagnostic.name}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{diagnostic.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <motion.div
            className="w-3 h-3 rounded-full ml-2 flex-shrink-0"
            animate={{
              backgroundColor: isSelected ? "var(--primary)" : "rgba(125,125,125,0.3)",
              scale: isSelected ? [1, 1.2, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{diagnostic.date === "Unknown date" ? "No date available" : diagnostic.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="h-3 w-3" />
            <span>{diagnostic.odometer}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
