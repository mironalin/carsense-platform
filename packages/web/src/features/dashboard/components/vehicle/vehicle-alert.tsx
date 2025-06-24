import { AlertTriangle } from "lucide-react";

type VehicleAlertProps = {
  activeDTCsCount: number;
};

export function VehicleAlert({ activeDTCsCount }: VehicleAlertProps) {
  if (activeDTCsCount === 0)
    return null;

  return (
    <div className="relative p-4 rounded-xl bg-gradient-to-br from-red-50/80 via-red-50/40 to-background dark:from-red-950/40 dark:via-red-950/20 dark:to-background border border-red-200/60 dark:border-red-800/60 backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-red-100/80 dark:bg-red-900/40 border border-red-200/60 dark:border-red-800/60 shrink-0 backdrop-blur-sm">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm text-red-700 dark:text-red-300 mb-1">
            {activeDTCsCount}
            {" "}
            Active Diagnostic Trouble Code
            {activeDTCsCount > 1 ? "s" : ""}
          </div>
          <div className="text-sm text-muted-foreground">
            Your vehicle requires attention. Consider scheduling a diagnostic session to address these issues.
          </div>
        </div>
      </div>
    </div>
  );
}
