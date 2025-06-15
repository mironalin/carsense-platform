import { Card, CardContent } from "@/components/ui/card";

export function ComparisonEmptyState({ message = "Please select diagnostic sessions to compare sensor data" }: { message?: string }) {
  return (
    <Card>
      <CardContent className="p-8">
        <div className="rounded-md bg-muted/50 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            {message}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
