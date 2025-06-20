import { motion } from "framer-motion";
import { Info } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { cardVariants } from "../../utils/animation-variants";

export function NoDiagnosticSelected() {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Card className="w-full min-h-[600px]">
        <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-5">
            <Info className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">No Diagnostic Selected</h3>
          <p className="text-muted-foreground max-w-[500px] text-lg">
            Select a diagnostic session to view its DTCs (Diagnostic Trouble Codes).
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
