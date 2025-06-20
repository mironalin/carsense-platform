import { motion } from "framer-motion";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { cardVariants } from "../../utils/animation-variants";

export function ErrorLoadingDTCs() {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Card className="w-full min-h-[600px]">
        <CardHeader>
          <CardTitle>Diagnostic Trouble Codes</CardTitle>
          <CardDescription>Error loading DTCs</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-lg mb-2">Failed to load diagnostic trouble codes.</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
