import { Calendar } from "lucide-react";

type LastDiagnosticInfoProps = {
  lastDiagnosticDate: string;
};

export function LastDiagnosticInfo({ lastDiagnosticDate }: LastDiagnosticInfoProps) {
  return (
    <div className="relative p-4 rounded-xl bg-gradient-to-br from-primary/8 via-primary/4 to-background dark:from-primary/12 dark:via-primary/6 dark:to-background border border-primary/20 dark:border-primary/15 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/25 backdrop-blur-sm">
          <Calendar className="h-4 w-4 text-primary" />
        </div>
        <div>
          <div className="font-semibold text-sm text-foreground">Last Diagnostic Session</div>
          <div className="text-sm text-muted-foreground">
            {new Date(lastDiagnosticDate).toLocaleDateString([], {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            {" "}
            at
            {" "}
            {new Date(lastDiagnosticDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
