import { FileText, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategoryIcon } from "@/features/sensors/utils/sensor-categories";

type TableStateProps = {
  title?: string;
  category?: string;
};

export function EmptyTableState({ title = "Sensor Data", category }: TableStateProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getCategoryIcon(category || "Unknown", "h-4 w-4")}
          <span className="text-lg font-medium">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-2 text-center">
          <FileText className="h-10 w-10 text-muted-foreground/50" />
          <div>
            <p className="font-medium">No sensor data available</p>
            <p className="text-sm text-muted-foreground">Select sensors to display their data</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function LoadingTableState({ title = "Sensor Data", category }: TableStateProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getCategoryIcon(category || "Unknown", "h-4 w-4")}
          <span className="text-lg font-medium">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading sensor data...</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function NoResultsState() {
  return (
    <div className="flex flex-col items-center gap-2 text-center py-8">
      <FileText className="h-10 w-10 text-muted-foreground/50" />
      <div>
        <p className="font-medium">No results found</p>
        <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
      </div>
    </div>
  );
}
