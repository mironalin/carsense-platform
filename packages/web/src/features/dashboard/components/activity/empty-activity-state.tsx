import { Calendar } from "lucide-react";

export function EmptyActivityState() {
  return (
    <div className="flex items-center justify-center h-[400px] text-muted-foreground px-6">
      <div className="text-center">
        <Calendar className="h-8 w-8 mx-auto mb-3 opacity-50" />
        <p className="font-medium text-sm">No Recent Activity</p>
        <p className="text-xs">Activity will appear here as you use the system</p>
      </div>
    </div>
  );
}
