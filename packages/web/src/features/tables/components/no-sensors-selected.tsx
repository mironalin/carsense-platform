import { Card, CardContent } from "@/components/ui/card";

export function NoSensorsSelected() {
  return (
    <Card>
      <CardContent className="text-center">
        <p className="text-muted-foreground font-semibold">No sensors selected</p>
        <p className="text-sm text-muted-foreground mt-1">Select sensors from above to view their data tables</p>
      </CardContent>
    </Card>
  );
}
