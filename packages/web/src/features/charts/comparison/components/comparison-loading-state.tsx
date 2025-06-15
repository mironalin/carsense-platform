import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ComparisonLoadingState() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Loading comparison data...</CardTitle>
        <CardDescription>
          Please wait while we load your sensor comparison data
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
