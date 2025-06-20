import { motion } from "framer-motion";
import { MoveLeft, MoveRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

import { buttonAnimation } from "../../utils/animation-variants";

type ConfigureExportFooterProps = {
  onBack: () => void;
  onNext: () => void;
};

export function ConfigureExportFooter({ onBack, onNext }: ConfigureExportFooterProps) {
  return (
    <CardFooter className="flex justify-between border-t pt-4">
      <motion.div variants={buttonAnimation} whileHover="hover" whileTap="tap">
        <Button variant="ghost" onClick={onBack}>
          <MoveLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </motion.div>
      <motion.div variants={buttonAnimation} whileHover="hover" whileTap="tap">
        <Button onClick={onNext}>
          Next
          <MoveRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </CardFooter>
  );
}
