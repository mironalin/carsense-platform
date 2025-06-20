import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

type DiagnosticsFooterProps = {
  selectedCount: number;
  onNext: () => void;
};

export function DiagnosticsFooter({ selectedCount, onNext }: DiagnosticsFooterProps) {
  return (
    <CardFooter className="flex justify-between border-t pt-4">
      <div className="text-sm text-muted-foreground">
        {selectedCount}
        {" "}
        diagnostics selected
      </div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={onNext}
          disabled={selectedCount === 0}
          className="ml-auto"
        >
          Next
          <MoveRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </CardFooter>
  );
}
