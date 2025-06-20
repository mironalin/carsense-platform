import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type DiagnosticsHeaderProps = {
  selectedCount: number;
  onClearAll: () => void;
  onSelectAll: () => void;
  isSelectAllDisabled: boolean;
  isClearAllDisabled: boolean;
};

export function DiagnosticsHeader({
  selectedCount,
  onClearAll,
  onSelectAll,
  isSelectAllDisabled,
  isClearAllDisabled,
}: DiagnosticsHeaderProps) {
  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle>Available Diagnostics</CardTitle>
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAll}
              disabled={isClearAllDisabled}
              className="h-8 text-xs"
            >
              Clear All
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={onSelectAll}
              disabled={isSelectAllDisabled}
              className="h-8 text-xs"
            >
              Select All
            </Button>
          </motion.div>
        </div>
      </div>
      <CardDescription>
        Choose the diagnostics you want to export
        <Badge variant="outline" className="ml-2 text-xs px-1.5 py-0">
          {selectedCount}
          {" "}
          selected
        </Badge>
      </CardDescription>
    </CardHeader>
  );
}
