import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function DiagnosticsError() {
  return (
    <Card className="bg-destructive/10">
      <CardHeader>
        <CardTitle>Error Loading Diagnostics</CardTitle>
        <CardDescription>
          There was a problem loading diagnostic data. Please try again.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </CardFooter>
    </Card>
  );
}
