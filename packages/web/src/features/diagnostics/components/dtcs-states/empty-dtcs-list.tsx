import { motion } from "framer-motion";
import { Database, Info } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { cardVariants } from "../../utils/animation-variants";

type EmptyDTCsListProps = {
  diagnosticId: string;
};

export function EmptyDTCsList({ diagnosticId }: EmptyDTCsListProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Card className="w-full min-h-[600px]">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-y-2">
            <div>
              <CardTitle>Diagnostic Trouble Codes</CardTitle>
              <CardDescription>No DTCs found in this diagnostic session</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {new Date(diagnosticId || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
              <Info className="h-10 w-10" />
            </div>
            <p className="text-xl font-medium mb-3 text-center">No issues detected</p>
            <p className="mb-5 text-lg text-center">
              No diagnostic trouble codes were found for this session.
            </p>
            <p className="text-md text-center">
              This is good news! Your vehicle is not reporting any trouble codes at the moment.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
