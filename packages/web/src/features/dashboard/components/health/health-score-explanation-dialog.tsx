import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type HealthScoreExplanationDialogProps = {
  children: React.ReactNode;
};

export function HealthScoreExplanationDialog({ children }: HealthScoreExplanationDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Health Score Calculation</DialogTitle>
          <DialogDescription>
            Your vehicle's health score is calculated using multiple factors to give you a comprehensive view of your vehicle's condition.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="font-medium text-sm">DTC Impact</span>
                    <span className="text-xs text-muted-foreground">(-40 points max)</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Diagnostic trouble codes indicate vehicle issues. Higher severity codes have greater impact.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="font-medium text-sm">Maintenance Patterns</span>
                    <span className="text-xs text-muted-foreground">(-20 points max)</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Excessive repairs or high maintenance costs may indicate underlying problems.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium text-sm">Diagnostic Frequency</span>
                    <span className="text-xs text-muted-foreground">(-15 points max)</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Too many diagnostic sessions may suggest recurring issues.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-sm">Maintenance Neglect</span>
                    <span className="text-xs text-muted-foreground">(-10 points max)</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Long gaps without diagnostics may indicate lack of regular maintenance.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-sm">Proactive Maintenance</span>
                    <span className="text-xs text-muted-foreground">(+10 points max)</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Regular maintenance without active DTCs shows good vehicle care.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-sm mb-3">Health Status Levels</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="font-medium">95-100: Excellent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">85-94: Very Good</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium">70-84: Good</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="font-medium">55-69: Fair</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="font-medium">40-54: Poor</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                  <span className="font-medium">0-39: Critical</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-sm mb-2">Tips to Improve Your Score</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Address active DTCs promptly</li>
                <li>• Maintain regular diagnostic check-ups</li>
                <li>• Keep up with scheduled maintenance</li>
                <li>• Monitor trends and act on early warnings</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
