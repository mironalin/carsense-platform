import { Card, CardContent } from "@/components/ui/card";

export function NoDataAvailable() {
  return (
    <Card>
      <CardContent className="text-center">
        <p className="text-muted-foreground font-semibold">No sensor data available</p>
        <p className="text-sm text-muted-foreground mt-1">
          There is no sensor data for the selected diagnostic session
        </p>
      </CardContent>
    </Card>
  );
}
