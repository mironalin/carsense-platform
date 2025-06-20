import { motion } from "framer-motion";

import { ScrollArea } from "@/components/ui/scroll-area";

import type { DiagnosticDTCWithInfo } from "../types";

import { listVariants } from "../utils/animation-variants";
import { DTCCard } from "./dtc-card";

type DTCsScrollContainerProps = {
  dtcs: DiagnosticDTCWithInfo[];
};

export function DTCsScrollContainer({ dtcs }: DTCsScrollContainerProps) {
  return (
    <div className="h-full rounded-xl overflow-hidden bg-background/80 shadow-sm border border-border/40 dark:border-border/20">
      <div className="h-full relative">
        {/* Top indicator - optimized for both light and dark modes */}
        <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
          <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent dark:via-primary/30"></div>
        </div>

        <ScrollArea className="h-full">
          <div className="p-6">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              {dtcs.map((dtc: DiagnosticDTCWithInfo, index: number) => (
                <DTCCard key={dtc.uuid} dtc={dtc} index={index} />
              ))}
            </motion.div>
          </div>
        </ScrollArea>

        {/* Bottom indicator - optimized for both light and dark modes */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
          <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent dark:via-primary/30"></div>
        </div>
      </div>
    </div>
  );
}
