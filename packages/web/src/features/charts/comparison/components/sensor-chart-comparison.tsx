import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SensorChartComparisonProps = {
  isLoading: boolean;
};

export function SensorChartComparison({ isLoading }: SensorChartComparisonProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading comparison data...</CardTitle>
          <CardDescription>
            Please wait while we load your sensor comparison data
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sensor Comparison</CardTitle>
        <CardDescription>
          Compare sensor data across multiple diagnostic sessions (Coming soon)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="py-4 text-center text-muted-foreground">
          This feature will be implemented in the next phase.
        </div>
      </CardContent>
    </Card>
  );
}
